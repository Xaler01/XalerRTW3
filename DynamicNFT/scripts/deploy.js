const hre = require("hardhat");

async function main() {
  //Get the contract to deploy and deployed
  const DynamicNFT = await hre.ethers.getContractFactory ("DynamicNFT");
  const dynamicNFT = await DynamicNFT.deploy();
  await dynamicNFT.deployed();
  console.log("DynamicNFT is deployed to ", dynamicNFT.address, "by @Xaler01");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
