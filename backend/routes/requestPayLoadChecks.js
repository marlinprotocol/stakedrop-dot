const { Joi } = require("express-validation");

const registerPayload = {
  body: Joi.object({
    stakingAddress: Joi.string().required().trim(),
    ethereumAddress: Joi.string().required().trim(),
    transactionHash: Joi.string().required().trim(),
  }),
};

const unregisterPayload = {
  body: Joi.object({
    stakingAddress: Joi.string().required().trim(),
    transactionHash: Joi.string().required().trim(),
  }),
};

const transactionPayload = {
  params: Joi.object({
    hash: Joi.string().required().trim(),
  }),
};

const validatorListingPayload = {
  body: Joi.object({
    key: Joi.string().required().trim(),
    validatorAddress: Joi.string().required().trim(),
  }),
};

module.exports = {
  registerPayload,
  transactionPayload,
  unregisterPayload,
  validatorListingPayload,
};
