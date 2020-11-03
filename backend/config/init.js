const { params } = require("../models");
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
