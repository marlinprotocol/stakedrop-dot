require("./config/checkEnv");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { HttpProvider } = require("@polkadot/rpc-provider");
// const provider = new WsProvider("ws://172.17.0.1:9944/");
const polkadotRpcUrl = process.env.POLKADOT_RPC;
const provider = new HttpProvider(polkadotRpcUrl);

//global
mongoose = require("mongoose");
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};
// use promise latter
try {
  let user = process.env.MONGO_USER || "admin";
  let password = process.env.MONGO_PASSWORD || "password";
  let mongo_url = process.env.MONGO_URL || "mongo:27017";
  let dbName = process.env.MONGO_DB_NAME || "admin";
  mongoose.connect(
    `mongodb://${user}:${password}@${mongo_url}/${dbName}`,
    options
  );
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
    polkadot.saveValidators();
    return;
  })
  .then(function () {
    polkadot.feeder();
    return;
  })
  .then(function () {
    polkadot.saveTransactions();
    return;
  })
  .then(function () {
    require("./server");
  });
