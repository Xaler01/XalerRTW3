// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

//Returns the Ethereum balances of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther (balanceBigInt);
}

//logs the Ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

//Logs the memos storted on chain from coffe purchases.
async function printMemos (memos){
  for (const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log (`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`)
  }
}

async function main() {
  //Get example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  //Get the contract to deploy and deployed
  const TipsApp = await hre.ethers.getContractFactory ("TipsApp");
  const tipsApp = await TipsApp.deploy();
  await tipsApp.deployed();
  console.log("TipsApp is deployed to ", tipsApp.address, "by Xaler");

  //Chack the balances before the  coffee purchase
  const addresses = [owner.address, tipper.address, tipsApp.address];
  console.log ("== Start ==");
  await printBalances(addresses);

  //Buy the owner a feww coffees
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await tipsApp.connect(tipper).tipsApp ("Lucas", "You are the best!", tip);
  await tipsApp.connect(tipper2).tipsApp ("Frida", "I love you my sir", tip);
  await tipsApp.connect(tipper3).tipsApp ("Miguel", "Amazing people :)", tip);

  //Check balances after coffe purchases

  console.log ("== Bought Coffee ==");
  await printBalances(addresses);

  //Withdraw balances
  await tipsApp.connect(owner).withDrawTips ();

  // Check balances after withdraws
  console.log ("== Whitdraw Tips ==");
  await printBalances(addresses);

  //Read all the memos left for the owner
  console.log ("== Memos==")
  const memos = await tipsApp.getMemos ();  
  printMemos (memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});