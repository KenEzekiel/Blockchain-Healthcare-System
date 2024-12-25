import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MedicalRecordsModule = buildModule("MedicalRecordsModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords", []);

  const provider1 = m.getParameter("provider1", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const provider2 = m.getParameter("provider2", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

  m.call(medicalRecords, "authorizeProvider", [provider1], {id: "authorizeProvider1"});
  m.call(medicalRecords, "authorizeProvider", [provider2], {id: "authorizeProvider2"});

  return { medicalRecords };
});

export default MedicalRecordsModule;