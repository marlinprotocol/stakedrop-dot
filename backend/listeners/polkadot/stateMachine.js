const { polkadot: polkadotConstants } = require("../../constants");

async function findState(testParams) {
  let feederEra = testParams.filter(function (obj) {
    return obj.param == polkadotConstants.feederEra;
  })[0];

  let freezeEra = testParams.filter(function (obj) {
    return obj.param == polkadotConstants.freezeEra;
  })[0];

  let totalEra = testParams.filter(function (obj) {
    return obj.param == polkadotConstants.totalStakeFeeder;
  })[0];

  let validatorEra = testParams.filter(function (obj) {
    return obj.param == polkadotConstants.validatorStakeFeeder;
  })[0];

  let delegatorEra = testParams.filter(function (obj) {
    return obj.param == polkadotConstants.delegatorStakeFeeder;
  })[0];

  // print({
  //   feederEra,
  //   freezeEra,
  //   totalEra,
  //   validatorEra,
  //   delegatorEra,
  // });

  if (
    feederEra.value == freezeEra.value &&
    freezeEra.value == totalEra.value &&
    totalEra.value == delegatorEra.value &&
    delegatorEra.value == validatorEra.value
  ) {
    return "S1";
  } else if (
    feederEra.value == freezeEra.value &&
    freezeEra.value == totalEra.value &&
    totalEra.value == delegatorEra.value &&
    delegatorEra.value == validatorEra.value - 1
  ) {
    // throw new Error("S2 testing Error");
    return "S2";
  } else if (
    feederEra.value == freezeEra.value - 1 &&
    freezeEra.value - 1 == totalEra.value &&
    totalEra.value == delegatorEra.value &&
    delegatorEra.value == validatorEra.value - 1
  ) {
    // throw new Error("S3 testing Error");
    return "S3";
  } else if (
    feederEra.value == freezeEra.value - 1 &&
    freezeEra.value - 1 == totalEra.value - 1 &&
    totalEra.value - 1 == delegatorEra.value &&
    delegatorEra.value == validatorEra.value - 1
  ) {
    // throw new Error("S4 testing Error");
    return "S4";
  } else if (
    feederEra.value == freezeEra.value - 1 &&
    freezeEra.value - 1 == totalEra.value - 1 &&
    totalEra.value - 1 == delegatorEra.value - 1 &&
    delegatorEra.value - 1 == validatorEra.value - 1
  ) {
    // throw new Error("S5 testing Error");
    return "S5";
  } else {
    throw new Error("Unknown State");
  }
}

module.exports = {
  findState,
};

function print(data) {
  console.log(JSON.stringify(data, null, 4));
}
