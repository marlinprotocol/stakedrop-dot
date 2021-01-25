const distributionAbi = require("./distributionAbi.json");
const stakeRegistryAbi = require("./stakeRegistryAbi.json");
const tokenAbi = require("./tokenAbi.json");

// # // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// # // Distribution address 0x7b45587B7a993aE4481A713de4a4b487C05308C2
// # // ValidatorRegistry address 0x56dF8F7306DceECf9Bb91b2ee861032D575E0972
// # // StakeRegistry address 0x04149a2cCb98f649302BbdCc4a3D7118B7ABcAf5
// # // AddressRegistry address 0x63B222F4222ac71DE4be09A06cE5C4Fd0B5a2635
// # // mPondLogic address 0x49F86fAff3cf45C66872b1C1135f309Cd6468DB9
// # // mPondProxy address 0x9c2B9044e1e52f2fAC04A4A843C2d4cE9f5Ff3f0
// # // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Distribution address 0x27F9C69F1a95E1283D71F876687E5fC72ecD1116
// ValidatorRegistry address 0xC1423350f37c6F4a6E9F96435d50D70f95bBE499
// StakeRegistry address 0x22BDBd03753298df08f2103BCaDD0a53922A34c6
// AddressRegistry address 0x6094367346ef75c7ae080Fdb46b0e8C8f378583d
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// const tokenAddress = "0xD439a0f22e0d8020764Db754efd7Af78100c6389"; // this was deployed from remix browser

// polkadot (source: 0xAFCE0a493E59665d9B3a2A845A166c34E27B11dD) (rewardPerEpoch: 365000000000000000)
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Distribution address 0x175fa5aDC16Df1819832CDcDd5fc513Ba3B8c206
// ValidatorRegistry address 0xbfcF2159eEF214De2C0810dA653c4a0a36Bd4921
// StakeRegistry address 0x189822D70222db1E2411EeA9953637906e04D0CE
// AddressRegistry address 0xa9Df661074D195b21086ef65162695350426F02C
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ERC 677BridgeToken: 0xF9c7483851017744FE0A5D79607AC609619B9eA7

const network = {
  MATIC: {
    DISTRIBUTION_CONTRACT_ADDRESS: "0x175fa5aDC16Df1819832CDcDd5fc513Ba3B8c206",
    STAKE_REGISTRY_CONTRACT_ADDRESS:
      "0x189822D70222db1E2411EeA9953637906e04D0CE",
    TOKEN_CONTRACT_ADDRESS: "0xF9c7483851017744FE0A5D79607AC609619B9eA7",
  },
  KOVAN: {
    DISTRIBUTION_CONTRACT_ADDRESS: "0x7b45587B7a993aE4481A713de4a4b487C05308C2",
    STAKE_REGISTRY_CONTRACT_ADDRESS:
      "0x04149a2cCb98f649302BbdCc4a3D7118B7ABcAf5",
    TOKEN_CONTRACT_ADDRESS: "0x9c2B9044e1e52f2fAC04A4A843C2d4cE9f5Ff3f0",
  },
  MATIC_MUMBAI: {
    DISTRIBUTION_CONTRACT_ADDRESS: "0x27F9C69F1a95E1283D71F876687E5fC72ecD1116",
    STAKE_REGISTRY_CONTRACT_ADDRESS:
      "0x22BDBd03753298df08f2103BCaDD0a53922A34c6",
    TOKEN_CONTRACT_ADDRESS: "0xD439a0f22e0d8020764Db754efd7Af78100c6389",
  },
  PROD: {
    DISTRIBUTION_CONTRACT_ADDRESS: "0x2ef72f4cb462421c17a4d90e08c568b9e0aa5ee7",
    STAKE_REGISTRY_CONTRACT_ADDRESS:
      "0x4ab72Ca6b3dF67676EcA7c11afAB4E2B2F04EE18",
    TOKEN_CONTRACT_ADDRESS: "0x27B064fE4B708fDa0fD0C4ff2b78a1e4DAB812D1",
  },
};

const distributionAddress =
  network[process.env.NETWORK].DISTRIBUTION_CONTRACT_ADDRESS;
const stakeRegistryAddress =
  network[process.env.NETWORK].STAKE_REGISTRY_CONTRACT_ADDRESS;
const tokenAddress = network[process.env.NETWORK].TOKEN_CONTRACT_ADDRESS;

module.exports = {
  distribution: { abi: distributionAbi, address: distributionAddress },
  stakeRegistry: { abi: stakeRegistryAbi, address: stakeRegistryAddress },
  token: { abi: tokenAbi, address: tokenAddress },
};
