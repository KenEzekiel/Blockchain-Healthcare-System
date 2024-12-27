import { ethers } from "hardhat";
import { expect } from "chai";

describe("MedicalRecords", function () {
  let medicalRecords: any;
  let admin: any, provider1: any, provider2: any, allowedContract: any, unauthorizedContract: any;

  beforeEach(async function () {
    const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    medicalRecords = await MedicalRecords.deploy();
    await medicalRecords.waitForDeployment();

    [admin, provider1, provider2, allowedContract, unauthorizedContract] = await ethers.getSigners();
  });

  it("Should authorize providers", async function () {
    await medicalRecords.connect(admin).authorizeProvider(provider1.address);
    expect(await medicalRecords.authorizedProviders(provider1.address)).to.be.true;
  });

  it("Should add and retrieve records", async function () {
    await medicalRecords.connect(admin).authorizeProvider(provider1.address);

    const encryptedNIK = "367414141414141";
    const encryptedData = "encrypted-datasfsfsfsfs-example";

    await medicalRecords.connect(provider1).addRecord(encryptedNIK, encryptedData);

    const records = await medicalRecords.connect(provider1).getRecords(encryptedNIK);
    expect(records[0].encryptedData).to.equal(encryptedData);
  });
  describe("Admin functionalities", function () {
    it("Should allow admin to set the allowed contract", async function () {
      await medicalRecords.setAllowedContract(allowedContract.address);
      expect(await medicalRecords.allowedContract()).to.equal(allowedContract.address);
    });

    it("Should revert if a non-admin tries to set the allowed contract", async function () {
      await expect(
        medicalRecords.connect(provider1).setAllowedContract(allowedContract.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

})