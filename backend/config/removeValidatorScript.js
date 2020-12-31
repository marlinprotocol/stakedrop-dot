require("dotenv").config();
mongoose = require("mongoose");

var options = {};

if (process.env.NODE_ENV == "prod") {
  options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  };
} else {
  options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  };
}

try {
  let user = process.env.MONGO_USER || "admin";
  let password = process.env.MONGO_PASSWORD || "password";
  let mongo_url = process.env.MONGO_URL || "mongo:27017";
  let dbName = process.env.MONGO_DB_NAME || "admin";
  let connectionString;
  if (process.env.NODE_ENV == "prod") {
    connectionString = process.env.MONGO_CONNECTION;
  } else {
    connectionString = `mongodb://${user}:${password}@${mongo_url}/${dbName}`;
  }
  mongoose
    .connect(connectionString, options)
    .then(function () {
      return remove();
    })
    .then(function (data) {
      console.log(data);
      return;
    })
    .then(function () {
      console.log("Exiting the code with status 0");
      process.exit(0);
    });
} catch (ex) {
  console.log(ex);
  process.exit(1);
}

// edit this array to remove validators (or)
// pass new validatorremoveress as argument
let validatorsToRemove = ["14cxMDpBNLsNEXWyCzked3zghzaYWXwoqGT4h12GqQXdVhmn"];

async function remove() {
  const { whitelistedValidators } = require("../models");
  if (process.argv[2]) {
    await whitelistedValidators.deleteOne({
      validatorAddress: process.argv[2],
    });
  } else {
    for (let index = 0; index < validatorsToRemove.length; index++) {
      const element = validatorsToRemove[index];
      await whitelistedValidators.deleteOne({ validatorAddress: element });
    }
  }
  return "Remove validators successful";
}
