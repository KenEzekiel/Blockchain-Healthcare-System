import Web3 from "web3";
import Insurance from "../abi/Insurance.json";
import MedicalRecordsArtifacts from "../abi/MedicalRecords.json";
import MedicalToken from "../abi/MedicalToken.json";
import PriceOracle from "../abi/PriceOracle.json";

export const INSURANCE_CONTRACT_ADDRESS =
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const MEDICAL_TOKEN_ADDRESS =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const MEDICAL_RECORD_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ORACLE_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export function getInsuranceContract(web3: Web3) {
  try {
    const insuranceContract = new web3.eth.Contract(
      Insurance.abi,
      INSURANCE_CONTRACT_ADDRESS
    );
    console.log("Insurance contract instance created:", insuranceContract);
    return insuranceContract;
  } catch (error) {
    console.error("Error creating insurance contract instance:", error);
    return null;
  }
}

export function getMedRecContract(web3: Web3) {
  try {
    const medRecContract = new web3.eth.Contract(
      MedicalRecordsArtifacts.abi,
      MEDICAL_RECORD_ADDRESS
    );
    console.log("Medical Records contract instance created:", medRecContract);
    return medRecContract;
  } catch (error) {
    console.error("Error creating medical records contract instance:", error);
    return null;
  }
}

export function getTokenContract(web3: Web3) {
  try {
    const tokenContract = new web3.eth.Contract(
      MedicalToken.abi,
      MEDICAL_TOKEN_ADDRESS
    );
    console.log("medical token contract instance created:", tokenContract);
    return tokenContract;
  } catch (error) {
    console.error("Error creating medical token contract instance:", error);
    return null;
  }
}

export function getOracleContract(web3: Web3) {
  try {
    const oracleContract = new web3.eth.Contract(
      PriceOracle.abi,
      ORACLE_ADDRESS
    );
    console.log("oracle contract instance created:", oracleContract);
    return oracleContract;
  } catch (error) {
    console.error("Error creating oracle contract instance:", error);
    return null;
  }
}

export async function getGasPrice(web3: Web3) {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    console.log("Current gas price:", gasPrice);
    return gasPrice;
  } catch (error) {
    console.error("Error getting gas price:", error);
    throw error;
  }
}

export function setupContractsEventListener(web3: Web3) {
  const insurance = getInsuranceContract(web3);
  const medrec = getMedRecContract(web3);

  if (!insurance || !medrec) {
    console.error("Contract instance is null. Cannot set up event listeners.");
    return;
  } else if (!insurance.events || !medrec.events) {
    console.error(
      "Contract events are undefined. Check your ABI and contract deployment."
    );
    return;
  }

  try {
    // Listen for PremiumPaid
    insurance.events.PremiumPaid({}).on("data", (event) => {
      console.log("PremiumPaid event received:", event);
      // event.returnValues holds the arguments: user, year, month, amount
    });

    // Listen for Claimed (if desired)
    insurance.events.Claimed({}).on("data", (event) => {
      console.log("Claimed event received:", event);
      // event.returnValues holds (user, year, month, claimAmount, provider, medrecIdentifier)
    });

    // Listen for SetPremium (if desired)
    insurance.events.SetPremium({}).on("data", (event) => {
      console.log("SetPremium event received:", event);
      // event.returnValues holds (oldAmount, newAmount)
    });

    medrec.events.RecordAdded({}).on("data", (event) => {
      console.log("RecordAdded event received:", event);
      // event.returnValues holds (nik, index, timestamp, isPaid)
    });
    // If the MedRec contract also emits events, set them up similarly:
    // medrec.events.SomeEventName({})
    //   .on("data", ...)
    //   .on("error", ...);
  } catch (error) {
    console.error("Error setting up event listeners:", error);
  }
}

/**
 * Pay the premium for a given (month, year).
 * This is a state-changing function => use `send()`.
 */
export async function payPremium(
  web3: Web3,
  month: number,
  year: number,
  nik: number
): Promise<unknown> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    // Send the transaction
    const txReceipt = await insurance.methods
      .payPremium(nik.toString(), month, year)
      .send({ from: fromAddress });

    console.log("Premium paid. TX receipt:", txReceipt);
    return txReceipt;
  } catch (error) {
    console.error("Error paying premium:", error);
    throw error;
  }
}

/**
 * Check if a user is active for a given (month, year).
 * This is a read-only/view function => use `call()`.
 */
export async function isActive(
  web3: Web3,
  nik: number,
  year: number,
  month: number
): Promise<boolean> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    console.log(`Checking user insurance for ${nik} ${year} month ${month}`);
    const active: boolean = await insurance.methods
      .isActive(nik.toString(), year, month)
      .call();

    console.log("Is active?", active);
    return active;
  } catch (error) {
    console.error("Error checking isActive:", error);
    throw error;
  }
}

/**
 * Claim insurance for a specific (month, year).
 * This is a state-changing function => use `send()`.
 * `provider` is the address to which the claim is paid (in your contract).
 */
export async function claim(
  web3: Web3,
  year: number,
  month: number,
  provider: string,
  nik: string,
  recordIndex: number
): Promise<unknown> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    console.log(year, month, provider, nik, recordIndex);

    const txReceipt = await insurance.methods
      .claim(year, month, provider, nik, recordIndex)
      .send({ from: fromAddress });

    console.log("Claim successful. TX receipt:", txReceipt);
    return txReceipt;
  } catch (error) {
    console.error("Error claiming insurance:", error);
    throw error;
  }
}

/**
 * Set a new premium amount (owner-only).
 * This is a state-changing function => use `send()`.
 * @param newAmount in the token's smallest unit
 */
export async function setPremiumAmount(
  web3: Web3,
  newAmount: string
): Promise<unknown> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const accounts = await web3.eth.getAccounts();
    const ownerAddress = accounts[0]; // Must be contract owner

    const txReceipt = await insurance.methods
      .setPremiumAmount(newAmount)
      .send({ from: ownerAddress });

    console.log("Premium amount updated:", txReceipt);
    return txReceipt;
  } catch (error) {
    console.error("Error setting premium amount:", error);
    throw error;
  }
}

export async function getPremiumAmount(web3: Web3) {
  try {
    const oracle = getOracleContract(web3);
    if (!oracle) throw new Error("Oracle contract not found");

    const premiumPrice = await oracle.methods.getPremiumPrice().call();

    console.log("Premium Price:", premiumPrice);

    return Number(premiumPrice); // Return as a number
  } catch (error) {
    console.error("Error getting premium amount:", error);
    throw error;
  }
}

/**
 * Set a new claim amount (owner-only).
 * This is a state-changing function => use `send()`.
 * @param newClaimAmount in the token's smallest unit
 */
export async function setClaimAmount(
  web3: Web3,
  newClaimAmount: string
): Promise<unknown> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const accounts = await web3.eth.getAccounts();
    const ownerAddress = accounts[0]; // Must be contract owner

    const txReceipt = await insurance.methods
      .setClaimAmount(newClaimAmount)
      .send({ from: ownerAddress });

    console.log("Claim amount updated:", txReceipt);
    return txReceipt;
  } catch (error) {
    console.error("Error setting claim amount:", error);
    throw error;
  }
}

/**
 * Withdraw tokens from the contract to the owner address (owner-only).
 * @param amount in the token's smallest unit
 */
export async function withdrawTokens(
  web3: Web3,
  amount: string
): Promise<unknown> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const accounts = await web3.eth.getAccounts();
    const ownerAddress = accounts[0]; // Must be contract owner

    const txReceipt = await insurance.methods
      .withdrawTokens(amount)
      .send({ from: ownerAddress });

    console.log("Tokens withdrawn:", txReceipt);
    return txReceipt;
  } catch (error) {
    console.error("Error withdrawing tokens:", error);
    throw error;
  }
}

export async function getTokenBalance(web3: Web3, account: string) {
  try {
    // Initialize the token contract
    const tokenContract = getTokenContract(web3);

    // Call the balanceOf function
    const balanceWei = await tokenContract!.methods.balanceOf(account).call() as any;

    // Convert the balance to a human-readable format (if your token uses 18 decimals)
    const balance = web3.utils.fromWei(balanceWei, "ether"); // Assuming the token uses 18 decimals

    console.log(`Balance of account ${account}: ${balance} tokens`);
    return balance;
  } catch (error) {
    console.error("Error getting token balance:", error);
  }
}
