const { ApiPromise, WsProvider } = require("@polkadot/api");
const { HttpProvider } = require("@polkadot/rpc-provider");
// const provider = new WsProvider("ws://172.17.0.1:9944/");
const provider = new HttpProvider("http://34.93.40.96:4443/");

//global
mongoose = require("mongoose");
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};
// use promise latter
try {
  mongoose.connect("mongodb://admin:password@mongo:27017/admin", options);
} catch (ex) {
  console.log(ex);
  process.exit(1);
}

const init = require("./config/init");
const { polkadot } = require("./listeners");
//global
polkadotApi = {};
ApiPromise.create({ provider })
  .then(function (api) {
    polkadotApi = api;
    return init();
  })
  .then(function (data) {
    console.log(data);
    polkadot.updatelatestEra();
    return;
  })
  .then(function () {
    // polkadot.saveValidators();
    return;
  })
  .then(function () {
    // polkadot.feeder();
    return;
  })
  .then(function () {
    polkadot.saveTransactions();
    return;
  })
  .then(function () {
    require("./server");
  });
