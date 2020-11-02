const { Keyring } = require("@polkadot/api");
const keyring = new Keyring({ type: "sr25519" });
const ethereum_address = require("ethereum-address");
const { stringToU8a, u8aToHex, hexToU8a } = require("@polkadot/util");
const {
  registeredAddresses,
  transactions,
  whitelistedValidators,
} = require("../models");

const checkEthereumAddress = () => async (req, res, next) => {
  try {
    let { ethereumAddress } = req.params;
    if (ethereum_address.isAddress(ethereumAddress)) {
      return next();
    } else {
      return next("invalid ethereum address");
    }
  } catch (error) {
    return next(error);
  }
};

const checkPolkadotAddress = () => async (req, res, next) => {
  try {
    let { stakingAddress } = req.params;
    keyring.addFromAddress(stakingAddress);
    return next();
  } catch (error) {
    return next(error);
  }
};

const checkRegisterPayload = () => async (req, res, next) => {
  try {
    let { stakingAddress, ethereumAddress } = req.body;
    if (ethereum_address.isAddress(ethereumAddress)) {
      keyring.addFromAddress(stakingAddress);
      return next();
    } else {
      return next("Invalid ethereumAddress");
    }
  } catch (error) {
    return next(error);
  }
};

const checkUnregisterPayload = () => async (req, res, next) => {
  try {
    let { stakingAddress } = req.body;
    keyring.addFromAddress(stakingAddress);
    return next();
  } catch (error) {
    return next(error);
  }
};

const isEthAddressAvailableForRegistration = () => async (req, res, next) => {
  try {
    let { ethereumAddress } = req.body;
    let _data = await registeredAddresses.findOne({ ethereumAddress });
    if (_data) {
      return next("Ethereum Address Already occupied");
    } else {
      return next();
    }
  } catch (error) {
    return next(error);
  }
};

const isStakingAddressAvailableForRegistration = () => async (
  req,
  res,
  next
) => {
  try {
    let { stakingAddress: address } = req.body;
    let _data = await registeredAddresses.findOne({ address });
    if (_data) {
      return next("Staking Address Already occupied");
    } else {
      return next();
    }
  } catch (error) {
    return next(error);
  }
};

const unregisterAddress = () => async (req, res, next) => {
  try {
    let { stakingAddress: address } = req.body;
    let _data = await registeredAddresses.findOne({ address });
    if (_data) {
      return next();
    } else {
      return next("No such staking address is available");
    }
  } catch (error) {
    return next(error);
  }
};

const validateTransactionHash = () => async (req, res, next) => {
  try {
    let { transactionHash } = req.body;
    let _data = await transactions.findOne({ transactionHash });
    if (_data) {
      return next();
    } else {
      return next(`${transactionHash} not found`);
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const onlyAdmin = () => async (req, res, next) => {
  let { key } = req.body;
  if (key && key == process.env.PRE_SHARED_KEY) {
    return next();
  } else {
    return next("Permission Denied");
  }
};

const checkValidatorPayload = () => async (req, res, next) => {
  try {
    let { validatorAddress } = req.body;
    keyring.addFromAddress(validatorAddress);
    return next();
  } catch (error) {
    return next(error);
  }
};

const checkValidatorBeforeRemoval = () => async (req, res, next) => {
  try {
    let { validatorAddress } = req.body;
    let _data = await whitelistedValidators.findOne({ validatorAddress });
    if (_data) {
      return next();
    } else {
      return next("No such validator exists");
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = {
  checkEthereumAddress,
  checkPolkadotAddress,
  checkRegisterPayload,
  isStakingAddressAvailableForRegistration,
  isEthAddressAvailableForRegistration,
  checkUnregisterPayload,
  unregisterAddress,
  validateTransactionHash,
  onlyAdmin,
  checkValidatorPayload,
  checkValidatorBeforeRemoval,
};
