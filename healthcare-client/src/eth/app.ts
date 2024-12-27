import Web3 from "web3";
import Insurance from "../abi/Insurance.json";
import MedicalRecordsABI from "../abi/MedicalRecordsABI.json";
import MedicalToken from "../abi/MedicalToken.json";
import {
  MedicalRecord,
  MedicalRecordsModule,
} from "@/modules/MedicalRecordsModule";

const INSURANCE_CONTRACT_ADDRESS = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";
const MEDICAL_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MEDICAL_RECORD_ADDRESS = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";

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
      MedicalRecordsABI,
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
  year: number
): Promise<unknown> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    // Send the transaction
    const txReceipt = await insurance.methods
      .payPremium(month, year)
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
  user: string,
  year: number,
  month: number
): Promise<boolean> {
  try {
    const insurance = getInsuranceContract(web3);
    if (!insurance) throw new Error("Insurance contract not found");

    const active: boolean = await insurance.methods
      .isActive(user, year, month)
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

export async function addMedrec(
  web3: Web3,
  tanggal: string,
  penyediaLayanan: string,
  nik: string,
  nama: string,
  diagnosa: string,
  tindakan: string,
  account: string
) {
  try {
    const medrec = getMedRecContract(web3);
    if (!medrec) throw new Error("Medical record contract not found");

    const medrecModule = new MedicalRecordsModule(
      "http://127.0.0.1:8545",
      MEDICAL_RECORD_ADDRESS,
      "password"
    );

    const medicalRecord: MedicalRecord = {
      checkupDate: new Date(tanggal).toISOString(),
      healthcareProvider: penyediaLayanan,
      nik: nik,
      name: nama,
      diagnosis: diagnosa,
      treatment: tindakan,
    };

    const recordIndex = await medrecModule.addRecord(
      nik,
      medicalRecord,
      account
    );

    // Ensure the recordIndex is a valid number before returning it
    if (recordIndex !== undefined && !isNaN(recordIndex)) {
      return Number(recordIndex);
    } else {
      throw new Error("Record index not found in the transaction receipt.");
    }
  } catch (error) {
    console.log("Failed adding medical record!", error);
  }
}

export async function getMedRec(web3: Web3, nik: string) {
  try {
    const medrec = getMedRecContract(web3);
    if (!medrec) throw new Error("Medical record contract not found");

    const medrecModule = new MedicalRecordsModule(
      "http://127.0.0.1:8545",
      MEDICAL_RECORD_ADDRESS,
      "password"
    );

    return medrecModule.getRecords(nik);
  } catch (error) {
    console.log("Failed getting medical record!", error);
  }
}
