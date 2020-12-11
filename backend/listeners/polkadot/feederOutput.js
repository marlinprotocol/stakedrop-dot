const { params, validators, delegators, totalStakes } = require("../../models");
const { polkadot: polkadotConstants } = require("../../constants");
const { findState } = require("./stateMachine");
const axios = require("axios");
const feederUrl = process.env.FEED_URL;

async function pumpFeed() {
  while (true) {
    try {
      // await induceDelay(5000);
      let testParams = await params.find({
        param: {
          $in: [
            polkadotConstants.feederEra,
            polkadotConstants.lastConfirmedEraForValidators,
            polkadotConstants.freezeEra,
            polkadotConstants.validatorStakeFeeder,
            polkadotConstants.delegatorStakeFeeder,
            polkadotConstants.totalStakeFeeder,
          ],
        },
      });
      let feederEra = testParams.filter(function (obj) {
        return obj.param == polkadotConstants.feederEra;
      })[0];
      let confirmedEra = testParams.filter(function (obj) {
        return obj.param == polkadotConstants.lastConfirmedEraForValidators;
      })[0];
      if (feederEra.value < confirmedEra.value) {
        // print(testParams);
        let state = await findState(testParams);
        print(state);
        if (state == "S1") {
          let validatorEra = testParams.filter(function (obj) {
            return obj.param == polkadotConstants.validatorStakeFeeder;
          })[0];
          await newS1_Operation(validatorEra);
        } else if (state == "S2") {
          let freezeEra = testParams.filter(function (obj) {
            return obj.param == polkadotConstants.freezeEra;
          })[0];
          await newS2_Operation(freezeEra);
        } else if (state == "S3") {
          let totalEra = testParams.filter(function (obj) {
            return obj.param == polkadotConstants.totalStakeFeeder;
          })[0];
          // throw new Error("S3 Operation in Progress");
          await newS3_Operation(totalEra);
        } else if (state == "S4") {
          let delegatorEra = testParams.filter(function (obj) {
            return obj.param == polkadotConstants.delegatorStakeFeeder;
          })[0];
          await newS4_Operation(delegatorEra);
        } else if (state == "S5") {
          let feederEra = testParams.filter(function (obj) {
            return obj.param == polkadotConstants.feederEra;
          })[0];
          await newS5_Operation(feederEra);
        } else {
          throw new Error(`Feeder detected unknown state ${state}`);
        }
        await induceDelay(60000);
      } else {
        await induceDelay(60000);
      }
    } catch (error) {
      console.log(error);
      await induceDelay(20000);
    }
  }
}

module.exports = pumpFeed;

function induceDelay(ts) {
  let delay = ts || 3000;
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, delay);
  });
}

function print(data) {
  console.log(JSON.stringify(data, null, 4));
}

async function newS1_Operation(validatorEra) {
  let validatorsData = await validators
    .find({ era: validatorEra.value, pushedToChain: false })
    .limit(100)
    .exec();
  if (validatorsData.length == 0) {
    // complete
    await params.updateOne(
      { param: validatorEra.param },
      { $inc: { value: 1 } }
    );
  } else {
    // print(validatorsData);
    for (let index = 0; index < validatorsData.length; index++) {
      const element = validatorsData[index];
      // console.log(element);
      let toFeed = {
        validatorAddress: element.validatorAddress,
        era: element.era,
        validatorStake: element.validatorStake,
      };
      // throw new Error("Validators need to be added");
      await axios.post(feederUrl + "/addValidator", toFeed);
      console.log(
        `Validator: ${element.validatorAddress} data sent via API call`
      );
      await validators.updateOne({ _id: element._id }, { pushedToChain: true });
    }
  }
}

async function newS2_Operation(freezeEra) {
  // freeze (freezeEra.value) api call for etherum
  // increase freezeEra.value by 1
  let toFeed = {
    value: freezeEra.value,
  };
  await axios.post(feederUrl + "/freezeEpoch", toFeed);
  console.log(`Freeze Era ${freezeEra.value} called via API Call`);
  await params.updateOne({ param: freezeEra.param }, { $inc: { value: 1 } });
  return;
}

async function newS3_Operation(totalEra) {
  let totalStake = await totalStakes.findOne({ era: totalEra.value });
  let stake = 0;
  if (totalStake) {
    stake = totalStake.value;
  }
  let toFeed = {
    era: totalEra.value,
    totalStake: stake,
  };
  await axios.post(feederUrl + "/addTotalStake", toFeed);
  console.log(`Total Era ${totalEra.value} called via API Call`);
  await params.updateOne({ param: totalEra.param }, { $inc: { value: 1 } });
  return;
}

async function newS4_Operation(delegatorEra) {
  let delegatorsData = await delegators
    .find({
      era: delegatorEra.value,
      pushedToChain: false,
    })
    .limit(100)
    .exec();

  if (delegatorsData.length == 0) {
    // complete
    await params.updateOne(
      { param: delegatorEra.param },
      { $inc: { value: 1 } }
    );
  } else {
    // print(delegatorsData);
    for (let index = 0; index < delegatorsData.length; index++) {
      const element = delegatorsData[index];
      // console.log(element);
      console.log(
        `Delegator: ${element.delegatorAddress} data sent via API Call`
      );
      let toFeed = {
        delegatorAddress: element.delegatorAddress,
        era: element.era,
        delegatorStake: element.delegatorStake,
        validatorAddress: element.validatorAddress,
        totalStakeInTheEra: element.totalStakeInTheEra,
      };
      // throw new Error("Delegators need to be added");
      await axios.post(feederUrl + "/addDelegator", toFeed);
      await delegators.updateOne({ _id: element._id }, { pushedToChain: true });
    }
  }
}

async function newS5_Operation(feederEra) {
  await params.updateOne({ param: feederEra.param }, { $inc: { value: 1 } });
  return;
}

// async function S1_Operation(freezeEra) {
//   // freeze (freezeEra.value) api call for etherum
//   // increase freezeEra.value by 1
//   await axios.post(feederUrl + "/freezeEpoch", freezeEra);
//   console.log(`Freeze Era ${freezeEra.value} called via API Call`);
//   await params.updateOne({ param: freezeEra.param }, { $inc: { value: 1 } });
//   return;
// }

// async function S2_Operation(totalEra) {
//   // addTotalStake via API call
//   // increase totalEra.value by 1
//   // throw new Error(`Total Era ${totalEra.value} called via API Call`);
//   let totalStake = await totalStakes.findOne({ era: totalEra.value });
//   let stake = 0;
//   if (totalStake) {
//     stake = totalStake.value;
//   }
//   await axios.post(feederUrl + "/addTotalStake", { era: totalEra, stake });
//   console.log(`Total Era ${totalEra.value} called via API Call`);
//   await params.updateOne({ param: totalEra.param }, { $inc: { value: 1 } });
//   return;
// }

// async function S3_Operation(validatorEra) {
//   let validatorsData = await validators
//     .find({ era: validatorEra.value, pushedToChain: false })
//     .limit(100)
//     .exec();
//   if (validatorsData.length == 0) {
//     // complete
//     await params.updateOne(
//       { param: validatorEra.param },
//       { $inc: { value: 1 } }
//     );
//   } else {
//     // print(validatorsData);
//     for (let index = 0; index < validatorsData.length; index++) {
//       const element = validatorsData[index];
//       // console.log(element);
//       console.log(
//         `Validator: ${element.validatorAddress} data sent via API call`
//       );
//       // throw new Error("Validators need to be added");
//       await axios.post(feederUrl + "/addValidator", element);
//       await validators.updateOne({ _id: element._id }, { pushedToChain: true });
//     }
//   }
// }

// async function S4_Operation(delegatorEra) {
//   let delegatorsData = await delegators
//     .find({
//       era: delegatorEra.value,
//       pushedToChain: false,
//     })
//     .limit(100)
//     .exec();

//   if (delegatorsData.length == 0) {
//     // complete
//     await params.updateOne(
//       { param: delegatorEra.param },
//       { $inc: { value: 1 } }
//     );
//   } else {
//     // print(delegatorsData);
//     for (let index = 0; index < delegatorsData.length; index++) {
//       const element = delegatorsData[index];
//       // console.log(element);
//       console.log(
//         `Delegator: ${element.delegatorAddress} data sent via API Call`
//       );
//       // throw new Error("Delegators need to be added");
//       await axios.post(feederUrl + "/addDelegator", element);
//       await delegators.updateOne({ _id: element._id }, { pushedToChain: true });
//     }
//   }
// }
