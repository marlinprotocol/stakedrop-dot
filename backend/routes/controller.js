const {
  totalStakes,
  registrations,
  registeredAddresses,
  transactions,
  b_delegators,
  whitelistedValidators,
} = require("../models");

const bip39 = require("bip39");
const { Keyring } = require("@polkadot/api");
const { stringToU8a, u8aToHex, hexToU8a } = require("@polkadot/util");
const keyring = new Keyring({ type: "sr25519" });
const axios = require("axios");
const feederUrl = process.env.FEED_URL;
const Bignumber = require("bignumber.js");

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
    return _data.depositDetails.pair.address;
  } else {
    let result = await createNewPair();
    await new registrations({
      stakingAddress,
      ethereumAddress,
      depositDetails: result,
    }).save();
    return result.pair.address;
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
      }
      info.message = `Your staking address has been delegating to ${_v}`;
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
  let _data = await transactions.findOne({ transactionHash: txHash });
  if (_data) {
    return { status: true };
  } else {
    return { status: false };
  }
}

async function addValidator(obj) {
  let { validatorAddress } = obj;
  await new whitelistedValidators({ validatorAddress }).save();
  return true;
}

async function removeValidator(obj) {
  let { validatorAddress } = obj;
  await whitelistedValidators.deleteOne({ validatorAddress });
  return true;
}

async function averageStakePerEpoch() {
  let average = new Bignumber(0);
  let _data = await totalStakes.find().sort({ era: "desc" }).limit(10);
  for (let index = 0; index < _data.length; index++) {
    const element = _data[index];
    average = average.plus(new Bignumber(element.value));
  }
  average = average.dividedBy(new Bignumber(_data.length));
  return average.toNumber();
}

module.exports = {
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
};
