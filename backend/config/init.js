const {
  params,
  whitelistedValidators,
  registeredAddresses,
} = require("../models");
const { polkadot } = require("../constants");
const chainStartEra = parseInt(process.env.CHAIN_START_ERA);
const chainStartBlock = parseInt(process.env.CHAIN_START_BLOCK);

async function init() {
  let latestEra = await params.findOne({ param: polkadot.latestEra });
  if (!latestEra) {
    latestEra = new params({
      param: polkadot.latestEra,
      value: chainStartEra,
    });
    await latestEra.save();
  }

  let confirmedEra = await params.findOne({ param: polkadot.lastConfirmedEra });
  if (!confirmedEra) {
    confirmedEra = new params({
      param: polkadot.lastConfirmedEra,
      value: chainStartEra,
    });
    await confirmedEra.save();
  }

  await check(polkadot.lastConfirmedEraForValidators, chainStartEra);
  await check(polkadot.lastConfirmedEraForDelegators, chainStartEra);
  await check(polkadot.lastConfirmedBlock, chainStartBlock);
  await check(polkadot.latestBlock, chainStartBlock);

  await check(polkadot.feederEra, chainStartEra);
  await check(polkadot.totalStakeFeeder, chainStartEra);
  await check(polkadot.validatorStakeFeeder, chainStartEra);
  await check(polkadot.delegatorStakeFeeder, chainStartEra);
  await check(polkadot.freezeEra, chainStartEra);

  if (process.env.NODE_ENV == "dev") {
    await addValidator([
      "1zugcag7cJVBtVRnFxv5Qftn7xKAnR6YJ9x4x3XLgGgmNnS",
      "15ictvkBL2D3aWxyoqh8roJkRC1tdFw3SCLqjyssjuf6yiC9",
      "14bARWgpfEiURUS7sGGb54V6mvteRhYWDovcjnFMsLfxRxVV",
      "1hJdgnAPSjfuHZFHzcorPnFvekSHihK9jdNPWHXgeuL7zaJ",
    ]);
  }

  if (process.env.NODE_ENV == "dev") {
    await addAddresses([
      {
        address: "14GvFJE8hqLyQFXkiEvGkTVtbTRGMU4wRC6jNHHKXykPnLA1",
        ethereumAddress: "0xFC57cBd6d372d25678ecFDC50f95cA6759b3162b",
      },
      {
        address: "16HvKyV9B61hsop3ZY6pWYeV537S29kd9pb9FMrPzx49ym5X",
        ethereumAddress: "0x025D3b4caCcc57D8D2485130AEE349F8C60Ab738",
      },
      {
        address: "14z4r6EJMkCeQyxrAuHfdbVJRESA3veXDcTxcViHuMj5dEEA",
        ethereumAddress: "0xdeFF2Cd841Bd47592760cE068a113b8E594F8553",
      },
    ]);
  }

  return "Init Complete";
}

module.exports = init;

async function check(param, value) {
  let _param = await params.findOne({ param });
  if (!_param) {
    await new params({ param, value }).save();
  }
  return;
}

async function addAddresses(registrations) {
  for (let index = 0; index < registrations.length; index++) {
    const element = registrations[index];
    let { address, ethereumAddress } = element;
    await addAddress(address, ethereumAddress);
  }
  return;
}

async function addAddress(address, ethereumAddress) {
  let _data = await registeredAddresses.findOne({ address });
  if (!_data) {
    await new registeredAddresses({ address, ethereumAddress }).save();
  }
  return;
}

async function addValidator(validators) {
  for (let index = 0; index < validators.length; index++) {
    const element = validators[index];
    await addWhiteListedValidator(element);
  }
}

async function addWhiteListedValidator(validatorAddress) {
  let _validator = await whitelistedValidators.findOne({ validatorAddress });
  if (!_validator) {
    await new whitelistedValidators({ validatorAddress }).save();
  }
  return;
}
