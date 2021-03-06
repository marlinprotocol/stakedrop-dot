const {
  totalStakes,
  registrations,
  registeredAddresses,
  transactions,
  b_delegators,
  delegators,
  u_delegators,
  whitelistedValidators,
  validators,
  params,
} = require("../models");

const { polkadot: polkadotConstants } = require("../constants");

const bip39 = require("bip39");
const { Keyring } = require("@polkadot/api");
const { stringToU8a, u8aToHex, hexToU8a } = require("@polkadot/util");
const keyring = new Keyring({ type: "sr25519" });
const axios = require("axios");
const feederUrl = process.env.FEED_URL;
const Bignumber = require("bignumber.js");
const delegator = require("../models/delegator");

async function latestEraForStakeDrop() {
  let _data = await params.findOne({ param: polkadotConstants.feederEra });
  return _data.value;
}

async function stats() {
  let _data = await params.find();
  _data = _data.map(function (obj) {
    return {
      param: obj.param,
      value: obj.value,
    };
  });
  return _data;
}

async function totalValueLocked() {
  let totalStake = await totalStakes
    .find({})
    .sort({ era: "desc" })
    .limit(1)
    .exec();
  if (totalStake.length == 0) {
    return 0;
  } else {
    return totalStake[0].value;
  }
}

async function createNewPair() {
  const mnemonic = bip39.generateMnemonic();
  const newPair = keyring.addFromUri(mnemonic);
  const dataToReturn = {
    mnemonic,
    pair: newPair.toJson(),
  };
  return dataToReturn;
}

async function getDepositAddress(obj) {
  let { ethereumAddress, stakingAddress } = obj;
  if (ethereumAddress.length == 42) {
    ethereumAddress = ethereumAddress.split("x")[1];
  }
  ethereumAddress = ethereumAddress.toLowerCase();
  let _data = await registrations.findOne({ stakingAddress, ethereumAddress });
  if (_data) {
    //   console.log(_data.depositDetails.pair);
    return keyring.encodeAddress(_data.depositDetails.pair.address, 0);
  } else {
    let result = await createNewPair();
    await new registrations({
      stakingAddress,
      ethereumAddress,
      depositDetails: result,
    }).save();
    return keyring.encodeAddress(result.pair.address, 0);
  }
}

async function isEthereumAddressRegistered(obj) {
  let { ethereumAddress } = obj;
  if (ethereumAddress.length == 42) {
    ethereumAddress = ethereumAddress.split("x")[1];
  }
  ethereumAddress = ethereumAddress.toLowerCase();
  let _data = await registeredAddresses.findOne({ ethereumAddress });
  if (_data) {
    return {
      status: true,
      ethereumAddress,
      stakingAddress: _data.address,
    };
  } else {
    return { status: false };
  }
}

async function isStakingAddressRegistered(obj) {
  let { stakingAddress: address } = obj;
  let _data = await registeredAddresses.findOne({ address });
  if (_data) {
    return {
      status: true,
      ethereumAddress: _data.ethereumAddress,
      stakingAddress: address,
    };
  } else {
    return { status: false };
  }
}

async function register(obj) {
  try {
    let { stakingAddress: address, ethereumAddress } = obj;
    if (ethereumAddress.length == 42) {
      ethereumAddress = ethereumAddress.split("x")[1];
    }
    ethereumAddress = ethereumAddress.toLowerCase();
    let blackListedRewards = await b_delegators
      .findOne({ delegatorAddress: address })
      .sort({ era: "desc" })
      .exec();
    let info = {};
    if (!blackListedRewards) {
      let _v = "unregistered validator: ";
      if (blackListedRewards && blackListedRewards.validatorAddress) {
        _v = _v + blackListedRewards.validatorAddress;
        info.message = `Your staking address has been delegating to ${_v}`;
      }
      let _data = await whitelistedValidators.find();
      info.whitelistedValidators = _data.map(function (obj) {
        return obj.validatorAddress;
      });
    }
    await axios.post(feederUrl + "/addAddress", {
      stakingAddress: address,
      ethereumAddress: "0x" + ethereumAddress,
    });
    await new registeredAddresses({ address, ethereumAddress }).save();
    return { status: true, info };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}

async function getWhiteListedValidators() {
  let _data = await whitelistedValidators.find();
  _data = _data.map(function (obj) {
    return obj.validatorAddress;
  });
  return _data;
}

async function unregister(obj) {
  try {
    let { stakingAddress: address } = obj;
    let _data = await registeredAddresses.findOne({ address });
    await axios.post(feederUrl + "/removeAddress", {
      stakingAddress: address,
      ethereumAddress: "0x" + _data.ethereumAddress,
    });
    await registeredAddresses.deleteOne({ address });
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}

async function getTransaction(txHash) {
  if (txHash.slice(0, 2) != "0x") {
    txHash = "0x" + txHash;
  }
  let _data = await transactions.findOne({ transactionHash: txHash });
  if (_data) {
    return { status: true };
  } else {
    return { status: false };
  }
}

async function addValidator(obj) {
  try {
    let { validatorAddress } = obj;
    await new whitelistedValidators({ validatorAddress }).save();
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}

async function removeValidator(obj) {
  try {
    let { validatorAddress } = obj;
    await whitelistedValidators.deleteOne({ validatorAddress });
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}

async function averageStakePerEpoch() {
  let average = new Bignumber(0);
  let _data = await totalStakes.find().sort({ era: "desc" }).limit(10);
  for (let index = 0; index < _data.length; index++) {
    const element = _data[index];
    average = average.plus(new Bignumber(element.value));
  }
  if (_data.length != 0) {
    average = average.dividedBy(new Bignumber(_data.length));
  }
  return average.toNumber();
}

async function getOneStakeData(delegatorAddress, era) {
  let _validStake = await delegators.findOne({ delegatorAddress, era });
  let _unregisteredStake = await u_delegators.findOne({
    delegatorAddress,
    era,
  });
  let _blackListedStake = await b_delegators.findOne({ delegatorAddress, era });
  // console.log({ _validStake, _unregisteredStake, _blackListedStake });
  return { _validStake, _unregisteredStake, _blackListedStake };
}

async function getStakeData(delegatorAddress) {
  let { value: lastConfirmedEra } = await params.findOne({
    param: polkadotConstants.feederEra,
  });

  await newGetStakeData(delegatorAddress);
  let stakeElligibleForReward = [];
  let stakeBeforeRegistration = [];
  let stakeDelegatedToBlackListedValidator = [];

  for (let index = lastConfirmedEra - 1; index > 0; index--) {
    let {
      _validStake,
      _unregisteredStake,
      _blackListedStake,
    } = await getOneStakeData(delegatorAddress, index);
    if (_validStake) {
      stakeElligibleForReward.push({
        era: index,
        stake: _validStake.delegatorStake,
      });
    } else {
      stakeElligibleForReward.push({
        era: index,
        stake: 0,
      });
    }

    if (_unregisteredStake) {
      stakeBeforeRegistration.push({
        era: index,
        stake: _unregisteredStake.delegatorStake,
      });
    } else {
      stakeBeforeRegistration.push({
        era: index,
        stake: 0,
      });
    }

    if (_blackListedStake) {
      stakeDelegatedToBlackListedValidator.push({
        era: index,
        stake: _blackListedStake.delegatorStake,
      });
    } else {
      stakeDelegatedToBlackListedValidator.push({
        era: index,
        stake: 0,
      });
    }

    break;
  }
  let rewardStake = new Bignumber(0);
  let totalStake = new Bignumber(0);

  // console.log(stakeElligibleForReward, stakeBeforeRegistration, stakeDelegatedToBlackListedValidator);

  for (let index = 0; index < stakeElligibleForReward.length; index++) {
    const element = stakeElligibleForReward[index];
    rewardStake = rewardStake.plus(new Bignumber(element.stake));
    totalStake = totalStake.plus(new Bignumber(element.stake));
  }
  for (let index = 0; index < stakeBeforeRegistration.length; index++) {
    const element = stakeBeforeRegistration[index];
    rewardStake = rewardStake.plus(new Bignumber(element.stake));
    totalStake = totalStake.plus(new Bignumber(element.stake));
  }

  for (
    let index = 0;
    index < stakeDelegatedToBlackListedValidator.length;
    index++
  ) {
    const element = stakeDelegatedToBlackListedValidator[index];
    totalStake = totalStake.plus(new Bignumber(element.stake));
  }
  return {
    rewardStake: rewardStake.toNumber(),
    totalStake: totalStake.toNumber(),
  };
}

async function newGetStakeData(delegatorAddress) {
  let { value: lastConfirmedEra } = await params.findOne({
    param: polkadotConstants.feederEra,
  });
  let eraToVerify = lastConfirmedEra - 1;

  let _delegationData = await delegators.find({
    delegatorAddress,
    era: eraToVerify,
  });
  let _u_delegationData = await u_delegators.find({
    delegatorAddress,
    era: eraToVerify,
  });
  let _b_delegationData = await b_delegators.find({
    delegatorAddress,
    era: eraToVerify,
  });

  if (_delegationData.length != 0) {
    let rewardStake = new Bignumber(0);
    let totalStake = new Bignumber(0);
    for (let index = 0; index < _delegationData.length; index++) {
      const { delegatorStake } = _delegationData[index];
      rewardStake = rewardStake.plus(new Bignumber(delegatorStake));
      totalStake = totalStake.plus(new Bignumber(delegatorStake));
    }
    for (let index = 0; index < _b_delegationData.length; index++) {
      const { delegatorStake } = _b_delegationData[index];
      totalStake = totalStake.plus(new Bignumber(delegatorStake));
    }
    return {
      rewardStake: rewardStake.toNumber(),
      totalStake: totalStake.toNumber(),
    };
  }

  if (_u_delegationData.length != 0) {
    let rewardStake = new Bignumber(0);
    let totalStake = new Bignumber(0);
    for (let index = 0; index < _u_delegationData.length; index++) {
      const { delegatorStake } = _u_delegationData[index];
      rewardStake = rewardStake.plus(new Bignumber(delegatorStake));
      totalStake = totalStake.plus(new Bignumber(delegatorStake));
    }
    for (let index = 0; index < _b_delegationData.length; index++) {
      const { delegatorStake } = _b_delegationData[index];
      totalStake = totalStake.plus(new Bignumber(delegatorStake));
    }
    return {
      rewardStake: rewardStake.toNumber(),
      totalStake: totalStake.toNumber(),
    };
  }

  return {
    rewardStake: 0,
    totalStake: 0,
  };
}

async function checkTotalStakes() {
  let _data = await totalStakes.find();
  _data = _data.map(function (obj) {
    return {
      value: obj.value,
      era: obj.era,
    };
  });
  return _data;
}

async function checkTotalDelegators() {
  let _data = await delegators.find();
  _data = _data.map(function (obj) {
    return {
      delegatorAddress: obj.delegatorAddress,
      era: obj.era,
      delegatorStake: obj.delegatorStake,
      validatorAddress: obj.validatorAddress,
    };
  });
  return _data;
}

async function checkTotalValidators() {
  let _data = await validators.find();
  _data = _data.map(function (obj) {
    return {
      validatorAddress: obj.validatorAddress,
      era: obj.era,
      validatorStake: obj.validatorStake,
      validatorCollectedStake: obj.validatorCollectedStake,
    };
  });
  return _data;
}

module.exports = {
  getStakeData: newGetStakeData,
  totalValueLocked,
  getDepositAddress,
  isEthereumAddressRegistered,
  isStakingAddressRegistered,
  register,
  getTransaction,
  unregister,
  addValidator,
  removeValidator,
  averageStakePerEpoch,
  getWhiteListedValidators,
  latestEraForStakeDrop,
  stats,
  checkTotalStakes,
  checkTotalDelegators,
  checkTotalValidators,
};
