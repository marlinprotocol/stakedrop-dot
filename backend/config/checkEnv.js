const e = require("express");

const mainParam = "NODE_ENV";
if (mainParam in process.env) {
  console.log(`${mainParam} is defined`);
} else {
  console.log(`${mainParam} is not defined`);
  process.exit(1);
}
const devEnvParams = [
  "CHAIN_START_ERA",
  "CHAIN_START_BLOCK",
  "STAKE_DROP",
  "ONLY_WHITE_LISTED_VALIDATORS",
  "ONLY_REGISTERED_ADDRESSES",
  "FEED_URL",
  "POLKADOT_RPC",
  "VALIDATE_TRANSACTION_HASH",
  "NETWORK",
];

const prodEnvParams = [
  "CHAIN_START_ERA",
  "CHAIN_START_BLOCK",
  "STAKE_DROP",
  "ONLY_WHITE_LISTED_VALIDATORS",
  "ONLY_REGISTERED_ADDRESSES",
  "FEED_URL",
  "POLKADOT_RPC",
  "VALIDATE_TRANSACTION_HASH",
  "NETWORK",
  "MONGO_CONNECTION",
];

if (process.env.NODE_ENV == "prod") {
  checkParams(prodEnvParams);
} else {
  checkParams(devEnvParams);
}

function checkParams(params) {
  for (let index = 0; index < params.length; index++) {
    const element = params[index];
    //   console.log(`${element}`);
    if (element in process.env) {
      console.log(`${element} is defined in env variables`);
    } else {
      console.log(`${element} is not defined in env variables`);
      process.exit(1);
    }
  }
}
