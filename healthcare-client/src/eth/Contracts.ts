import Web3 from "web3";
import Insurance from "../abi/Insurance.json";
import MedicalRecordsABI from "../abi/MedicalRecordsABI.json";
import MedicalToken from "../abi/MedicalToken.json";

const INSURANCE_CONTRACT_ADDRESS = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const MEDICAL_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MEDICAL_RECORD_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

// Create a class to manage contract instances
export class Contracts {
  private web3: Web3;
  private insuranceContract: unknown | null = null;
  private medrecContract: unknown | null = null;
  private medicalTokenContract: unknown | null = null;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  // Method to get the Insurance contract instance (creates it if not already created)
  public getInsuranceContract(): unknown | null {
    if (!this.insuranceContract) {
      try {
        this.insuranceContract = new this.web3.eth.Contract(
          Insurance.abi,
          INSURANCE_CONTRACT_ADDRESS
        );
        console.log(
          "Insurance contract instance created:",
          this.insuranceContract
        );
      } catch (error) {
        console.error("Error creating insurance contract instance:", error);
        return null;
      }
    }
    return this.insuranceContract;
  }

  // Method to get the MedRec contract instance (creates it if not already created)
  public getMedRecContract(): unknown | null {
    if (!this.medrecContract) {
      try {
        this.medrecContract = new this.web3.eth.Contract(
          MedicalRecordsABI,
          MEDICAL_RECORD_ADDRESS
        );
        console.log(
          "Medical Records contract instance created:",
          this.medrecContract
        );
      } catch (error) {
        console.error(
          "Error creating medical records contract instance:",
          error
        );
        return null;
      }
    }
    return this.medrecContract;
  }

  // Method to get the MedicalToken contract instance (creates it if not already created)
  public getTokenContract(): unknown | null {
    if (!this.medicalTokenContract) {
      try {
        this.medicalTokenContract = new this.web3.eth.Contract(
          MedicalToken.abi,
          MEDICAL_TOKEN_ADDRESS
        );
        console.log(
          "Medical Token contract instance created:",
          this.medicalTokenContract
        );
      } catch (error) {
        console.error("Error creating medical token contract instance:", error);
        return null;
      }
    }
    return this.medicalTokenContract;
  }
}
