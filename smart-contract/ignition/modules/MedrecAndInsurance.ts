import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const CombinedModule = buildModule("CombinedModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords", []);

  const provider1 = m.getParameter("provider1", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const provider2 = m.getParameter("provider2", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

  m.call(medicalRecords, "authorizeProvider", [provider1], {id: "authorizeProvider1"});
  m.call(medicalRecords, "authorizeProvider", [provider2], {id: "authorizeProvider2"});

  const medicalTokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  const intermediaryAddress = ethers.getAddress(
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  );

  const oracleAddress = ethers.getAddress(
    "0x959922be3caee4b8cd9a407cc3ac1c251c2007b1"
  );

  const insurance = m.contract("Insurance", [
    medicalTokenAddress,
    oracleAddress,
    medicalRecords,
  ]);

  m.call(medicalRecords, "setAllowedContract", [insurance], {id: "setAllowedContract"});

  return {medicalRecords, insurance };
});

export default CombinedModule;
