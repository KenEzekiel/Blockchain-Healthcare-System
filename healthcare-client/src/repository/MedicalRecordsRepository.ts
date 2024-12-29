import Web3 from "web3";
import CryptoJS from "crypto-js";
import MedicalRecordsArtifacts from "../abi/MedicalRecords.json";

export type MedicalRecord = {
  checkupDate: string;
  healthcareProvider: string;
  nik: number;
  name: string;
  diagnosis: string;
  treatment: string;
};

export type MedicalRecordReturn = {
  checkupDate: string;
  healthcareProvider: string;
  nik: number;
  name: string;
  diagnosis: string;
  treatment: string;
  provider: string;
  timestamp: number;
  isPaid: boolean;
}

export class MedicalRecordsRepository {
  private web3: Web3;
  private contract: any;
  private secretKey: string;

  constructor(secretKey: string) {
    try {
      this.web3 = new Web3(new Web3.providers.HttpProvider(import.meta.env.VITE_BLOCKCHAIN_URL!));
      this.contract = new this.web3.eth.Contract(
        MedicalRecordsArtifacts.abi,
        import.meta.env.VITE_MEDICAL_RECORDS_ADDRESS!
      );
      this.secretKey = secretKey;
    } catch (error) {
      console.error("Error initializing MedicalRecordsRepository:", error);
      throw error;
    }
  }

  private encryptRecord(record: MedicalRecord): string {
    const recordString = JSON.stringify(record);
    return CryptoJS.AES.encrypt(recordString, this.secretKey).toString();
  }

  private decryptRecord(encryptedData: string): MedicalRecord {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString) as MedicalRecord;
  }

  async addRecord(
    patientNIK: number,
    record: MedicalRecord,
    fromAddress: string
  ): Promise<number> {
    try {
      const encryptedData = this.encryptRecord(record);

      const receipt = await this.contract.methods
        .addRecord(patientNIK.toString(), encryptedData)
        .send({ from: fromAddress });

      console.log("Transaction Receipt:", receipt);

      if (receipt.events && receipt.events.RecordAdded) {
        const { recordIndex, timestamp, isPaid } =
          receipt.events.RecordAdded.returnValues;

        console.log(`Record added for NIK: ${patientNIK}`);
        console.log(`Record index: ${recordIndex}`);
        console.log(
          `Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`
        );
        console.log(`Is Paid: ${isPaid}`);

        return Number(recordIndex);
      } else {
        console.error("RecordAdded event not found in the receipt.");
        return -1;
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  async getRecords(patientNIK: number): Promise<MedicalRecordReturn[]> {
    try {
      const records = await this.contract.methods.getRecords(patientNIK.toString()).call();
      return records.map((record: any) => {
        const decryptedData = this.decryptRecord(record.encryptedData);

        return {
          ...decryptedData, 
          provider: record.provider, 
          timestamp: record.timestamp,
          isPaid: record.isPaid, 
        };
      });
    } catch (error) {
      console.error("Error fetching records:", error);
      throw new Error("An unexpected error occurred while fetching records.");
    }
  }
}
