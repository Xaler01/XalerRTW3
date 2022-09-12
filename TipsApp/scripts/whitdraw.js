// scripts/withdraw.js

const hre = require("hardhat");
const abi = require("../artifacts/contracts/TipsApp.sol/TipsApp.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress="0xc0953968CC0f08Dfb4daF1AE71b061BBF3e2b50c";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider("maticmum", process.env.MUMBAI_API_KEY);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instantiate connected contract.
  const tipsApp = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("Current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, tipsApp.address);
  console.log("Current balance of contract: ", await getBalance(provider, tipsApp.address), "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("Withdrawing funds..")
    const withdrawTxn = await tipsApp.withDrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("No funds to withdraw!");
  }

  // Check ending balance.
  console.log("Current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });