const express = require("express");
const httpStatus = require("http-status");
const router = express.Router();
const { validate } = require("express-validation");
const {
  totalValueLocked,
  getDepositAddress,
  isEthereumAddressRegistered,
  isStakingAddressRegistered,
  register,
  unregister,
  getTransaction,
  addValidator,
  removeValidator,
  averageStakePerEpoch,
} = require("./controller");
const {
  checkEthereumAddress,
  checkPolkadotAddress,
  checkRegisterPayload,
  checkUnregisterPayload,
  isEthAddressAvailableForRegistration: r1,
  isStakingAddressAvailableForRegistration: r2,
  unregisterAddress: u1,
  validateTransactionHash,
  checkValidatorPayload,
  checkValidatorBeforeRemoval,
  onlyAdmin,
} = require("./middlewares");

const {
  registerPayload,
  transactionPayload,
  unregisterPayload,
  validatorListingPayload,
} = require("./requestPayLoadChecks");

module.exports = router;

router.get("/welcome", async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    message: "Welcome! to polkadot server",
  });
});

router.post("/welcome", async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    message: "Welcome! to polkadot server",
  });
});

router.get("/getTotalValueLocked", async (req, res, next) => {
  let value = await totalValueLocked();
  return res.status(httpStatus.OK).json({
    value,
  });
});

router.get(
  "/generateDepositAddress/:stakingAddress/:ethereumAddress",
  checkPolkadotAddress(),
  checkEthereumAddress(),
  async (req, res, next) => {
    console.log(req.params);
    let result = await getDepositAddress(req.params);
    return res.status(httpStatus.OK).json({
      address: result,
    });
  }
);

router.get(
  "/isEthereumAddressAvailable/:ethereumAddress",
  checkEthereumAddress(),
  async (req, res, next) => {
    let result = await isEthereumAddressRegistered(req.params);
    if (result.status) {
      return res.status(httpStatus.CONFLICT).json({
        status: false,
      });
    } else {
      return res.status(httpStatus.OK).json({
        status: true,
      });
    }
  }
);

router.get(
  "/isStakingAddressAvailable/:stakingAddress",
  checkPolkadotAddress(),
  async (req, res, next) => {
    let result = await isStakingAddressRegistered(req.params);
    if (result.status) {
      return res.status(httpStatus.CONFLICT).json({ status: false });
    } else {
      return res.status(httpStatus.OK).json({ status: true });
    }
  }
);

router.post(
  "/register",
  validate(registerPayload),
  validateTransactionHash(),
  checkRegisterPayload(),
  r1(),
  r2(),
  async (req, res, next) => {
    let { status, info } = await register(req.body);
    return res.status(httpStatus.OK).json({
      status,
      info,
    });
  }
);

router.post(
  "/unregister",
  validate(unregisterPayload),
  validateTransactionHash(),
  checkUnregisterPayload(),
  u1(),
  async (req, res, next) => {
    let { status } = await unregister(req.body);
    return res.status(httpStatus.OK).json({
      status,
    });
  }
);

router.get("/contractAddress", async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    contractAddress: process.env.CONTRACT_ADDRESS,
  });
});

router.get(
  "/transaction/:hash",
  validate(transactionPayload),
  async (req, res, next) => {
    let { hash } = req.params;
    let { status } = await getTransaction(hash);
    if (status) {
      return res.status(httpStatus.OK).json({ status });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({ status });
    }
  }
);

router.post(
  "/addWhiteListedValidator",
  onlyAdmin(),
  validate(validatorListingPayload),
  checkValidatorPayload(),
  async (req, res, next) => {
    let status = await addValidator(req.body);
    if (status) {
      return res.status(httpStatus.OK).json({ status });
    } else {
      return res.status(httpStatus.NOT_MODIFIED).json({ status });
    }
  }
);
router.post(
  "/removeWhiteListedValidator",
  onlyAdmin(),
  validate(validatorListingPayload),
  checkValidatorPayload(),
  checkValidatorBeforeRemoval(),
  async (req, res, next) => {
    let status = await removeValidator(req.body);
    if (status) {
      return res.status(httpStatus.OK).json({ status });
    } else {
      return res.status(httpStatus.NOT_MODIFIED).json({ status });
    }
  }
);

router.get("/averageStakePerEpoch", async (req, res, next) => {
  let value = await averageStakePerEpoch();
  return res.status(httpStatus.OK).json({ value });
});
