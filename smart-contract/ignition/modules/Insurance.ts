import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const Insurance = buildModule("InsuranceModule", (m) => {
  const medicalTokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  const intermediaryAddress = ethers.getAddress(
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  );

  const premiumAmount = "1000000000000000000"; // 1 * 1e18

  const claimAmount = "2000000000000000000"; // 2 * 1e18

  const insurance = m.contract("Insurance", [
    medicalTokenAddress,
    premiumAmount,
    claimAmount,
  ]);

  return { insurance };
});

export default Insurance;
