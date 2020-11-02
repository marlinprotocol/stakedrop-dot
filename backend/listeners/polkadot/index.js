const { validators } = require("../../models");
const latestEra = require("./latestEra");
const validator = require("./validator");
const feeder = require("./feederOutput");
const saveTransactions = require("./saveTransactions");

module.exports = {
  updatelatestEra: latestEra,
  saveValidators: validator,
  feeder,
  saveTransactions,
};
