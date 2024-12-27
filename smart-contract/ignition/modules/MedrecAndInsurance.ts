import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

// Define parameters for the MedicalToken contract deployment
const DEFAULT_INITIAL_OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Example address
const INITIAL_SUPPLY = 1_000_000n * 10n ** 18n; // 1 million tokens with 18 decimals

const CombinedModule = buildModule("CombinedModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords", []);

  // Parameter for the initial owner
  const initialOwner = m.getParameter("initialOwner", DEFAULT_INITIAL_OWNER);

  const medicalToken = m.contract("MedicalToken", [initialOwner]);

  // Mint initial supply after deployment
  m.call(medicalToken, "mint", [initialOwner, INITIAL_SUPPLY]);

  const premiumAmount = "100";

  const claimAmount = "200"; // 2 * 1e18

  const priceOracle = m.contract("PriceOracle", [premiumAmount, claimAmount]);

  const provider1 = m.getParameter(
    "provider1",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
  const provider2 = m.getParameter(
    "provider2",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  );

  m.call(medicalRecords, "authorizeProvider", [provider1], {
    id: "authorizeProvider1",
  });
  m.call(medicalRecords, "authorizeProvider", [provider2], {
    id: "authorizeProvider2",
  });

  const insurance = m.contract("Insurance", [
    medicalToken,
    priceOracle,
    medicalRecords,
  ]);

  m.call(medicalRecords, "setAllowedContract", [insurance], {
    id: "setAllowedContract",
  });

  return { medicalToken, medicalRecords, insurance, priceOracle };
});

export default CombinedModule;
