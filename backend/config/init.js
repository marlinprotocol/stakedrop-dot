const {
  params,
  whitelistedValidators,
  registeredAddresses,
} = require("../models");
const { polkadot } = require("../constants");
const chainStartEra = parseInt(process.env.CHAIN_START_ERA);
const chainStartBlock = parseInt(process.env.CHAIN_START_BLOCK);

async function init() {
  let latestEra = await params.findOne({ param: polkadot.latestEra });
  if (!latestEra) {
    latestEra = new params({
      param: polkadot.latestEra,
      value: chainStartEra,
    });
    await latestEra.save();
  }

  let confirmedEra = await params.findOne({ param: polkadot.lastConfirmedEra });
  if (!confirmedEra) {
    confirmedEra = new params({
      param: polkadot.lastConfirmedEra,
      value: chainStartEra,
    });
    await confirmedEra.save();
  }

  await check(polkadot.lastConfirmedEraForValidators, chainStartEra);
  await check(polkadot.lastConfirmedEraForDelegators, chainStartEra);
  await check(polkadot.lastConfirmedBlock, chainStartBlock);
  await check(polkadot.latestBlock, chainStartBlock);

  await check(polkadot.feederEra, chainStartEra);
  await check(polkadot.totalStakeFeeder, chainStartEra);
  await check(polkadot.validatorStakeFeeder, chainStartEra);
  await check(polkadot.delegatorStakeFeeder, chainStartEra);
  await check(polkadot.freezeEra, chainStartEra);

  if (process.env.NODE_ENV == "dev") {
    await addValidator([
      "1zugcag7cJVBtVRnFxv5Qftn7xKAnR6YJ9x4x3XLgGgmNnS",
      "15ictvkBL2D3aWxyoqh8roJkRC1tdFw3SCLqjyssjuf6yiC9",
      "14bARWgpfEiURUS7sGGb54V6mvteRhYWDovcjnFMsLfxRxVV",
      "1hJdgnAPSjfuHZFHzcorPnFvekSHihK9jdNPWHXgeuL7zaJ",
      "13eKBARPFWBdXJAKg4fBTNUfcz4YAYfDTetRRApuz1kTDVDg",
      "1zugcajKZ8XwjWvC5QZWcrpjfnjZZ9FfxRB9f5Hy6GdXBpZ",
      "1zugcaiwmKdWsfuubmCMBgKKMLSef2TEC3Gfvv5GxLGTKMN",
    ]);
  }

  if (process.env.NODE_ENV == "dev") {
    await addAddresses([
      {
        address: "14GvFJE8hqLyQFXkiEvGkTVtbTRGMU4wRC6jNHHKXykPnLA1",
        ethereumAddress: "0xFC57cBd6d372d25678ecFDC50f95cA6759b3162b"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "16HvKyV9B61hsop3ZY6pWYeV537S29kd9pb9FMrPzx49ym5X",
        ethereumAddress: "0x025D3b4caCcc57D8D2485130AEE349F8C60Ab738"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "14z4r6EJMkCeQyxrAuHfdbVJRESA3veXDcTxcViHuMj5dEEA",
        ethereumAddress: "0xdeFF2Cd841Bd47592760cE068a113b8E594F8553"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "13mbLCRUQyFQWEHniQQLZhkpRbJGw4Dkttec9fUuaKkR95X5",
        ethereumAddress: "0x60fEB537C1412d1C5ea5462a0984F058c347BC13"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "15oqs89aVy6bgk7PwyULibbxzyowGBjPxuQAduxeHor3pn9Y",
        ethereumAddress: "0xd2D0cD3E49Ee6724d1d403E3D4a9ee7AA8aD7627"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "14oUkrAXTfDpYtwuhAt1twZXCQ5VFfqE3dyXXY8WTFyexnez",
        ethereumAddress: "0x46D07d37704B15388d97Ca5F95E64F6d9801f9BF"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "1nfsMtBMV2b5CWr1PGgRhsPp7eg5wog6Aw7QF6rueWASqMU",
        ethereumAddress: "0x90C1AB208Bc7C22a4306BC70899622934BF0F513"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "124abMcBcToayqnaC3XhZZTmEwXR82B7PbwxXw1PuriRLXff",
        ethereumAddress: "0xFB22c0B729BF5F56aD904f71307FC247A82C2AF5"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "14GPSy2ugNGEV2ypB6X6h8yZ8sRiLEsyBHj6SemJPg36Q4P6",
        ethereumAddress: "0x15A9Cdbf563a613d4A07c890aC7A404a17157236"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "138J63FK8DcZMRgfBXmvpMXFVztwwT3MA87pWrTW8YDLjLKZ",
        ethereumAddress: "0x8da03780fcAF72e490c17e4cab8ad63195bE2084"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "15Dk12SYAncNj5vhjszjGetWhPAXrcShnC4tnh9Y3rbgUpis",
        ethereumAddress: "0x2a63a4188082270f172Ff8988fBaB252e4201BEe"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "15Mo7G4HY7c9RvR4ooKS975SQxj8f2Htxxw7VT99BHg1A6ug",
        ethereumAddress: "0x811e09Fd507730E9D42424d828908f714C5A607C"
          .toLowerCase()
          .split("x")[1],
      },
      {
        address: "121fFdzRKVJEPAcK2jqY3iJFwuue1MsUCXbEgdqiV9BsBDsS",
        ethereumAddress: "0xF1A1f124BA6914087f54825b4bCF1907B61d718E"
          .toLowerCase()
          .split("x")[1],
      },
    ]);
  }

  return "Init Complete";
}

module.exports = init;

async function check(param, value) {
  let _param = await params.findOne({ param });
  if (!_param) {
    await new params({ param, value }).save();
  }
  return;
}

async function addAddresses(registrations) {
  for (let index = 0; index < registrations.length; index++) {
    const element = registrations[index];
    let { address, ethereumAddress } = element;
    await addAddress(address, ethereumAddress);
  }
  return;
}

async function addAddress(address, ethereumAddress) {
  let _data = await registeredAddresses.findOne({ address });
  if (!_data) {
    await new registeredAddresses({ address, ethereumAddress }).save();
  }
  return;
}

async function addValidator(validators) {
  for (let index = 0; index < validators.length; index++) {
    const element = validators[index];
    await addWhiteListedValidator(element);
  }
}

async function addWhiteListedValidator(validatorAddress) {
  let _validator = await whitelistedValidators.findOne({ validatorAddress });
  if (!_validator) {
    await new whitelistedValidators({ validatorAddress }).save();
  }
  return;
}
