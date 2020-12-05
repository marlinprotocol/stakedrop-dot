const { Keyring } = require("@polkadot/api");
const keyring = new Keyring({ type: "sr25519" });

const ethereum_address = require("ethereum-address");

const {
  registeredAddresses,
  transactions,
  whitelistedValidators,
  registrations,
  params,
} = require("../models");

const { polkadot: polkadotConstants } = require("../constants");

const registrationConfirmationBlocks =
  process.env.REGISTRATION_CONFIRMATION_BLOCK || 14400;

const checkEthereumAddress = () => async (req, res, next) => {
  try {
    let { ethereumAddress } = req.params;
    ethereumAddress = ethereumAddress.trim();
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
    stakingAddress = stakingAddress.trim();
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
  if (process.env.VALIDATE_TRANSACTION_HASH.toUpperCase() == "FALSE") {
    return next();
  }

  try {
    let { ethereumAddress, stakingAddress } = req.body;
    if (ethereumAddress.length == 42) {
      ethereumAddress = ethereumAddress.split("x")[1];
    }
    ethereumAddress = ethereumAddress.toLowerCase();
    let { transactionHash } = req.body;
    if (transactionHash.slice(0, 2) != "0x") {
      transactionHash = "0x" + transactionHash;
    }
    let _data = await transactions.findOne({ transactionHash });
    if (_data) {
      let { method, args, blockNumber } = _data;
      if (method == "transfer") {
        let { dest } = args;
        let registrationDetails = await registrations.findOne({
          address: stakingAddress,
          ethereumAddress,
        });
        if (registrationDetails) {
          let addressToReceive =
            registrationDetails.depositDetails.pair.address;
          if (dest == keyring.encodeAddress(addressToReceive, 0)) {
            let latestBlock = await params.find(polkadotConstants.latestBlock);
            if (
              latestBlock.value >
              blockNumber + registrationConfirmationBlocks
            ) {
              return next(
                "Transaction should be sent less than 24 hours ago. Create a new one if it exceeds"
              );
            } else {
              return next();
            }
          } else {
            return next(
              `To Confirm your registration make sure you have sent 0.01 Dots to your regsitration address ${addressToReceive}`
            );
          }
        } else {
          return next(`You havent created any registration deposit address`);
        }
      } else {
        return next(`${transactionHash} should create an unbatched transfer`);
      }
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
