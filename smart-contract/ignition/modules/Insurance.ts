import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const Insurance = buildModule("InsuranceModule", (m) => {
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
  ]);

  return { insurance };
});

export default Insurance;
