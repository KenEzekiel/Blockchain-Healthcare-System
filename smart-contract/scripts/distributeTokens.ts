const { ethers } = require("hardhat");

async function main() {
  // Get signers (accounts)
  const [owner, ...otherAccounts] = await ethers.getSigners();
  
  // Deploy the token contract
  console.log("Deploying MedicalToken...");
  const MedicalToken = await ethers.getContractFactory("MedicalToken");
  const medicalToken = await MedicalToken.deploy(owner.address);
  await medicalToken.waitForDeployment();
  
  const deployedAddress = await medicalToken.getAddress();
  console.log("MedicalToken deployed to:", deployedAddress);

  // Mint initial supply to owner (1 million tokens)
  const initialSupply = ethers.parseEther("1000000");
  console.log("\nMinting tokens to owner...");
  try {
    const mintTx = await medicalToken.connect(owner).mint(owner.address, initialSupply);
    await mintTx.wait();
    console.log(`Minted ${ethers.formatEther(initialSupply)} tokens to owner`);
  } catch (err: any) {
    console.error("Minting failed:", err?.message || "Unknown error occurred");
    process.exit(1);
  }

  // Verify owner's balance after minting
  const ownerInitialBalance = await medicalToken.balanceOf(owner.address);
  console.log("Owner's initial balance:", ethers.formatEther(ownerInitialBalance), "tokens");

  // Amount to transfer to each account (10,000 tokens with 18 decimals)
  const transferAmount = ethers.parseEther("10000");

  // Transfer 10,000 tokens to each of the next 10 accounts
  console.log("\nDistributing tokens...");
  for (let i = 0; i < 10 && i < otherAccounts.length; i++) {
    const recipientAddress = otherAccounts[i].address;
    console.log(`Transferring ${ethers.formatEther(transferAmount)} tokens to ${recipientAddress}`);
    
    try {
      const tx = await medicalToken.connect(owner).transfer(recipientAddress, transferAmount);
      await tx.wait();
      
      // Verify the transfer
      const balance = await medicalToken.balanceOf(recipientAddress);
      console.log(`New balance of ${recipientAddress}: ${ethers.formatEther(balance)} tokens`);
    } catch (err: any) {
      if (err?.message) {
        console.error(`Failed to transfer to ${recipientAddress}:`, err.message);
      } else {
        console.error(`Failed to transfer to ${recipientAddress}:`, 'Unknown error occurred');
      }
    }
  }

  // Log final owner balance
  const ownerFinalBalance = await medicalToken.balanceOf(owner.address);
  console.log("\nFinal owner balance:", ethers.formatEther(ownerFinalBalance), "tokens");
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    if (err?.message) {
      console.error(err.message);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  });