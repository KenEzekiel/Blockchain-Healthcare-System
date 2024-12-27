async function checkBalance() {
  const [owner] = await ethers.getSigners();
  
  // Get the deployed token contract
  const MedicalToken = await ethers.getContractFactory("MedicalToken");
  const medicalToken = MedicalToken.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3"); // Use your deployed address

  // Check owner balance
  const balance = await medicalToken.balanceOf(owner.address);
  console.log("Contract address:", await medicalToken.getAddress());
  console.log("Owner address:", owner.address);
  console.log("Owner balance:", ethers.formatEther(balance));

  // Check total supply
  const totalSupply = await medicalToken.totalSupply();
  console.log("Total supply:", ethers.formatEther(totalSupply));
}

checkBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });