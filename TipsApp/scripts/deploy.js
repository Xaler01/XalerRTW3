const hre = require ("hardhat");

async function main (){
  //Get the contract to deploy and deployed
  const TipsApp = await hre.ethers.getContractFactory ("TipsApp");
  const tipsApp = await TipsApp.deploy();
  await tipsApp.deployed();
  console.log("TipsApp is deployed to ", tipsApp.address, "by Xaler");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  }); 