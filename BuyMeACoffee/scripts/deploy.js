const hre = require ("hardhat");

async function main (){
  //Get the contract to deploy and deployed
  const BuyMeACoffee = await hre.ethers.getContractFactory ("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee is deployed to ", buyMeACoffee.address, "by Xaler");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  }); 