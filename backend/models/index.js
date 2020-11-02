const validators = require("./validator");
const b_validators = require("./b_validators");
const params = require("./param");
const delegators = require("./delegator");
const u_delegators = require("./u_delegators");
const b_delegators = require("./b_delegators");
const totalStakes = require("./totalStake");
const whitelistedValidators = require("./whitelistedValidators");
const registeredAddresses = require("./registeredAddresses");
const transactions = require("./transactions");
const intrinsics = require("./intrinsics");
const registrations = require("./registrationCache");

module.exports = {
  validators,
  b_validators,
  params,
  delegators,
  u_delegators,
  totalStakes,
  whitelistedValidators,
  registeredAddresses,
  transactions,
  intrinsics,
  b_delegators,
  registrations,
};
