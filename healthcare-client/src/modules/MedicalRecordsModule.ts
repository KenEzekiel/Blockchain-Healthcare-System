import Web3 from "web3";
import CryptoJS from "crypto-js";
import MedicalRecordsABI from "../abi/MedicalRecordsABI.json";

export type MedicalRecord = {
  checkupDate: string;
  healthcareProvider: string;
  nik: string;
  name: string;
  diagnosis: string;
  treatment: string;
};

export class MedicalRecordsModule {
  private web3: Web3;
  private contract: any;
  private secretKey: string;

  constructor(providerUrl: string, contractAddress: string, secretKey: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    this.contract = new this.web3.eth.Contract(
      MedicalRecordsABI,
      contractAddress
    );
    this.secretKey = secretKey;
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

  async addRecord(patientNIK: string, record: MedicalRecord, fromAddress: string): Promise<number> {
    try {
      const encryptedData = this.encryptRecord(record);
  
      const receipt = await this.contract.methods
        .addRecord(patientNIK, encryptedData)
        .send({ from: fromAddress });
  
      console.log('Transaction Receipt:', receipt);
  
      if (receipt.events && receipt.events.RecordAdded) {
        const { recordIndex, timestamp, isPaid } = receipt.events.RecordAdded.returnValues;
  
        console.log(`Record added for NIK: ${patientNIK}`);
        console.log(`Record index: ${recordIndex}`);
        console.log(`Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
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

  async getRecords(patientNIK: string): Promise<MedicalRecord[]> {
    const records = await this.contract.methods.getRecords(patientNIK).call();
    return records.map((record: { encryptedData: string }) =>
      this.decryptRecord(record.encryptedData)
    );
  }
}
