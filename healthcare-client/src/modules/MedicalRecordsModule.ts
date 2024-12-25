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

  constructor(
    providerUrl: string,
    contractAddress: string,
    secretKey: string
  ) {
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

  async addRecord(patientNIK: string, record: MedicalRecord, fromAddress: string): Promise<void> {
    const encryptedData = this.encryptRecord(record);
    const tx = await this.contract.methods
      .addRecord(patientNIK, encryptedData)
      .send({ from: fromAddress });

    console.log(`Transaction hash: ${tx.transactionHash}`);
  }

  async getRecords(patientNIK: string): Promise<MedicalRecord[]> {
    const records = await this.contract.methods.getRecords(patientNIK).call();
    return records.map((record: { encryptedData: string }) =>
      this.decryptRecord(record.encryptedData)
    );
  }
}
