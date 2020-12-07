const { polkadot } = require("../../adapter");

async function updateEra() {
  while (true) {
    try {
      await induceDelay(10000);
      await polkadot.updateLatestEra();
      let currentEra = await polkadotApi.query.staking.currentEra();
      let totalStake = await polkadotApi.query.staking.erasTotalStake(
        currentEra.toHuman()
      );
      await polkadot.updateLatestBlock();
      // console.log("******************************");
      // console.log({ totalStake, currentEra: currentEra.toHuman() });
      // console.log("******************************");
    } catch (error) {
      console.log(error);
      await induceDelay(60000);
    }
  }
}

function induceDelay(ts) {
  let delay = ts || 3000;
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, delay);
  });
}

module.exports = updateEra;
