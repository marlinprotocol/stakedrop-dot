const distributionAbi = require("./distributionAbi.json");
const stakeRegistryAbi = require("./stakeRegistryAbi.json");

const distributionAddress = process.env.DISTRIBUTION_CONTRACT_ADDRESS;
const stakeRegistryAddress = process.env.STAKE_REGISTRY_CONTRACT_ADDRESS;

module.exports = {
  distribution: { abi: distributionAbi, address: distributionAddress },
  stakeRegistry: { abi: stakeRegistryAbi, address: stakeRegistryAddress },
};
