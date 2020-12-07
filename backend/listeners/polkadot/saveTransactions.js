const { polkadot } = require("../../adapter");
const {
  params,
  transactions: transaction,
  intrinsics: inherents,
} = require("../../models");
const { polkadot: polkadotConstants } = require("../../constants");

const { getTxHash } = require("@substrate/txwrapper");

async function checkLastConfirmedBlock() {
  while (true) {
    try {
      let testParams = await params.find({
        param: {
          $in: [
            polkadotConstants.latestBlock,
            polkadotConstants.lastConfirmedBlock,
          ],
        },
      });
      let latestBlock = testParams.filter(function (obj) {
        return obj.param == polkadotConstants.latestBlock;
      })[0];
      let lastConfirmedBlock = testParams.filter(function (obj) {
        return obj.param == polkadotConstants.lastConfirmedBlock;
      })[0];
      if (
        latestBlock &&
        lastConfirmedBlock &&
        lastConfirmedBlock.value + 4 > latestBlock.value
      ) {
        await induceDelay(60000);
      } else {
        let { block } = await polkadot.getBlock(lastConfirmedBlock.value);

        let toSaveExtrinsics = block.block.extrinsics;
        if (toSaveExtrinsics.length != 0) {
          await storeTransactions(toSaveExtrinsics, lastConfirmedBlock.value);
        }
        await polkadot.updateLastConfirmedBlock(++lastConfirmedBlock.value);
      }
    } catch (ex) {
      console.log(ex);
      await induceDelay(60000);
    }
  }
}

module.exports = checkLastConfirmedBlock;

function induceDelay(ts) {
  // console.log(`Induce Delay ${ts}`);
  let delay = ts;
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function storeTransactions(extrensics, blockNumber) {
  if (blockNumber % 100 == 0) {
    // console.log(`storing block ${blockNumber} and its transaction in db`);
  }
  let tx = extrensics.map((ex) => ex.toHuman());
  for (let index = 0; index < tx.length; index++) {
    if (!(blockNumber % 100) && (index % 5 == 0 || index == tx.length - 1)) {
      // console.log(
      //   `Storing transaction ${index}/${tx.length} in block: ${blockNumber}`
      // );
    }
    const element = tx[index];
    const { method, section } = element.method;
    const signer = element.signer;
    const { args } = extrensics[index]._raw.method.toJSON();
    const txHash = getTxHash(extrensics[index].toHex());

    if (signer) {
      let newtransaction = new transaction({
        address: signer,
        section,
        method,
        args,
        blockNumber,
        transactionHash: txHash,
      });
      await newtransaction.save();
    } else {
      let newIntrinsic = new inherents({
        section,
        method,
        args,
        blockNumber,
        transactionHash: txHash,
      });
      await newIntrinsic.save();
    }
  }
  return;
}
