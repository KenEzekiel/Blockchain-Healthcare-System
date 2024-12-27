const { ethers } = require("hardhat");

async function distributeTokens() {
  const [owner] = await ethers.getSigners();

  // Token contract address from your deployment
  const TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const INSURANCE = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  // Get the deployed token contract
  const MedicalToken = await ethers.getContractFactory("MedicalToken");
  const medicalToken = MedicalToken.attach(TOKEN_ADDRESS);

  // Amount to transfer to each account (10,000 tokens with 18 decimals)
  const transferAmount = ethers.parseEther("10000");

  // Get all signers (accounts)
  const signers = await ethers.getSigners();
  // Remove the first signer (owner) and take the next 10
  const recipients = signers.slice(1, 11);

  console.log("Starting token distribution...");
  console.log("Owner address:", owner.address);

  const tx = await medicalToken
    .connect(owner)
    .transfer(INSURANCE, transferAmount);
  await tx.wait();

  // Transfer 10,000 tokens to each of the next 10 accounts
  for (const recipient of recipients) {
    console.log(
      `Transferring ${ethers.formatEther(transferAmount)} tokens to ${
        recipient.address
      }`
    );

    try {
      const tx = await medicalToken
        .connect(owner)
        .transfer(recipient.address, transferAmount);
      await tx.wait();

      // Verify the transfer
      const balance = await medicalToken.balanceOf(recipient.address);
      //console.log(`New balance of ${recipient.address}: ${ethers.formatEther(balance)} tokens`);
    } catch (err: any) {
      console.error(
        "Minting failed:",
        err?.message || "Unknown error occurred"
      );
      console.error("Full error:", err);
      process.exit(1);
    }
  }

  // Verify final owner balance
  const finalBalance = await medicalToken.balanceOf(owner.address);
  console.log(
    "\nFinal owner balance:",
    ethers.formatEther(finalBalance),
    "tokens"
  );
}

distributeTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
