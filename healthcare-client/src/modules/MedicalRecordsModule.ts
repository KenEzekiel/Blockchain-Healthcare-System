import { ethers, Interface } from "ethers";
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
  private contract: ethers.Contract;
  private secretKey: string;

  constructor(
    contractAddress: string,
    providerOrSigner: ethers.Provider | ethers.Signer,
    secretKey: string
  ) {
    this.contract = new ethers.Contract(contractAddress, MedicalRecordsABI as any as Interface, providerOrSigner);
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

  async addRecord(patientNIK: string, record: MedicalRecord): Promise<void> {
    const encryptedData = this.encryptRecord(record);
    const tx = await this.contract.addRecord(patientNIK, encryptedData);
    await tx.wait();
    console.log(`Record added for patient: ${patientNIK}`);
  }

  async getRecords(patientNIK: string): Promise<MedicalRecord[]> {
    const records = await this.contract.getRecords(patientNIK);
    return records.map((record: { encryptedData: string }) =>
      this.decryptRecord(record.encryptedData)
    );
  }
}
