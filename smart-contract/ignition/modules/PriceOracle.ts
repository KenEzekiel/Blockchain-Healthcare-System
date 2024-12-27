import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const PriceOracle = buildModule("PriceOracleModule", (m) => {
  const premiumAmount = "1000000000000000000"; // 1 * 1e18

  const claimAmount = "2000000000000000000"; // 2 * 1e18

  const priceOracle = m.contract("PriceOracle", [premiumAmount, claimAmount]);

  return { priceOracle };
});

export default PriceOracle;
