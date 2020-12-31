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
      return add();
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

//
let validatorsToAdd = [
  "14cxMDpBNLsNEXWyCzked3zghzaYWXwoqGT4h12GqQXdVhmn",
  "This has to be modified",
];

async function add() {
  const { whitelistedValidators } = require("../models");
  for (let index = 0; index < validatorsToAdd.length; index++) {
    const element = validatorsToAdd[index];
    let _data = await whitelistedValidators.findOne({
      validatorAddress: element,
    });
    if (_data) {
      console.log(`${element} is already in db`);
    } else {
      await new whitelistedValidators({ validatorAddress: element }).save();
    }
  }
  return "Add validators";
}
