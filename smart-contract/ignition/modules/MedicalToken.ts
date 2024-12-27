import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Define parameters for the MedicalToken contract deployment
const DEFAULT_INITIAL_OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const INITIAL_SUPPLY = 1_000_000n * 10n ** 18n; // 1 million tokens with 18 decimals

const MedicalTokenModule = buildModule("MedicalTokenModule", (m) => {
  // Parameter for the initial owner
  const initialOwner = m.getParameter("initialOwner", DEFAULT_INITIAL_OWNER);

  const medicalToken = m.contract("MedicalToken", [initialOwner]);

  // Mint initial supply after deployment
  m.call(medicalToken, "mint", [initialOwner, INITIAL_SUPPLY]);

  return { medicalToken };
});

export default MedicalTokenModule;
