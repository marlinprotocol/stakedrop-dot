const {
  params,
  validators,
  delegators,
  whitelistedValidators,
  registeredAddresses,
  totalStakes,
  b_validators,
  u_delegators,
  b_delegators,
} = require("../../models");
const { polkadot } = require("../../constants");

async function getBlock(number) {
  let blockHash = await polkadotApi.rpc.chain.getBlockHash(number);
  let block = await polkadotApi.rpc.chain.getBlock(blockHash);
  return { blockHash, block };
}

async function updateLatestEra() {
  let currentEra = await polkadotApi.query.staking.currentEra();
  await params.updateOne(
    { param: polkadot.latestEra },
    {
      value: currentEra.toHuman(),
    }
  );
  return;
}

async function updateValidatorConfirmedEra(number) {
  await params.updateOne(
    { param: polkadot.lastConfirmedEraForValidators },
    {
      value: number,
    }
  );
  return;
}

async function updateLatestBlock() {
  let blockData = await polkadotApi.rpc.chain.getBlock();
  await params.updateOne(
    { param: polkadot.latestBlock },
    { value: blockData.toJSON().block.header.number }
  );
  return;
}

async function updateLastConfirmedBlock(number) {
  await params.updateOne(
    {
      param: polkadot.lastConfirmedBlock,
    },
    {
      value: number,
    }
  );
  return;
}

async function saveValidator(
  validatorAddress,
  era,
  validatorStake,
  validatorCollectedStake,
  options
) {
  let { isValidatorWhiteListed } = options;
  if (isValidatorWhiteListed) {
    let validatorData = await validators.findOne({ validatorAddress, era });
    if (!validatorData) {
      // throw new Error("Does not exists")
      // console.log(validatorData);
      await new validators({
        validatorAddress,
        era,
        validatorStake,
        validatorCollectedStake,
      }).save();
    } else {
      // throw new Error("Already exists");
      console.log(`Validator: ${validatorAddress} in era ${era} already added`);
    }
  } else {
    let validatorData = await b_validators.findOne({ validatorAddress, era });
    if (!validatorData) {
      // throw new Error("Does not exists")
      // console.log(validatorData);
      await new b_validators({
        validatorAddress,
        era,
        validatorStake,
        validatorCollectedStake,
      }).save();
    } else {
      // throw new Error("Already exists");
      console.log(`Validator: ${validatorAddress} in era ${era} already added`);
    }
  }
  let _isValidatorAlsoRegisteredAsDelegator = await isRegisteredAddress(
    validatorAddress
  );
  if (!_isValidatorAlsoRegisteredAsDelegator) {
    return { status: true };
  }
  await saveDelegator(
    validatorAddress,
    era,
    validatorStake,
    validatorCollectedStake,
    validatorAddress,
    { isRegisteredAddress: true, isValidatorWhiteListed: true }
  );
  return { status: true };
}

async function isValidatorWhiteListed(validatorAddress) {
  let validatorData = await whitelistedValidators.findOne({ validatorAddress });
  if (validatorData) {
    return true;
  }
  return false;
}

async function isRegisteredAddress(address) {
  let addressData = await registeredAddresses.findOne({ address });
  if (addressData) {
    return true;
  }
  return false;
}

async function saveDelegator(
  delegatorAddress,
  era,
  delegatorStake,
  totalStakeInTheEra,
  validatorAddress,
  options
) {
  let { isRegisteredAddress: isRegistered, isValidatorWhiteListed } = options;
  if (isRegistered) {
    if (isValidatorWhiteListed) {
      let delegatorData = await delegators.findOne({
        delegatorAddress,
        era,
        validatorAddress,
      });
      if (!delegatorData) {
        await new delegators({
          delegatorAddress,
          era,
          delegatorStake,
          totalStakeInTheEra,
          validatorAddress,
        }).save();
        await accumulateTotalStake(era, delegatorStake);
      } else {
        console.log(
          `Delegator: ${delegatorAddress} with validator: ${validatorAddress} in era ${era} already added`
        );
      }
    } else {
      let delegatorData = await b_delegators.findOne({
        delegatorAddress,
        era,
        validatorAddress,
      });
      if (!delegatorData) {
        await new b_delegators({
          delegatorAddress,
          era,
          delegatorStake,
          totalStakeInTheEra,
          validatorAddress,
        }).save();
        // await accumulateTotalStake(era, delegatorStake); // don't accumulate total stake if it is not whitelisted validator
      } else {
        console.log(
          `Delegator: ${delegatorAddress} with validator: ${validatorAddress} in era ${era} already added`
        );
      }
    }
  } else {
    let delegatorData = await u_delegators.findOne({
      delegatorAddress,
      era,
      validatorAddress,
    });
    if (!delegatorData) {
      await new u_delegators({
        delegatorAddress,
        era,
        delegatorStake,
        totalStakeInTheEra,
        validatorAddress,
      }).save();
      // await accumulateTotalStake(era, delegatorStake); // don't accumulate total stake if the validator is not registered
    } else {
      console.log(
        `Delegator: ${delegatorAddress} with validator: ${validatorAddress} in era ${era} already added`
      );
    }
  }
  return { status: true };
}

async function accumulateTotalStake(era, value) {
  // console.log("Accumulating stakes")
  let totalStakeData = await totalStakes.findOne({ era });
  if (totalStakeData) {
    await totalStakes.updateOne({ era }, { $inc: { value } });
  } else {
    await new totalStakes({ era, value }).save();
  }
  return;
}

module.exports = {
  updateLatestEra,
  updateValidatorConfirmedEra,
  updateLatestBlock,
  updateLastConfirmedBlock,
  getBlock,
  saveValidator,
  isValidatorWhiteListed,
  isRegisteredAddress,
  saveDelegator,
};

function induceDelay(ts) {
  let delay = ts || 3000;
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, delay);
  });
}
