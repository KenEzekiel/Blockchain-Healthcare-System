// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MedicalRecords {
    address public admin;
    address public allowedContract; 

    struct Record {
        string encryptedData;
        address provider;
        uint256 timestamp;
        bool isPaid; // Flag to track payment status
    }

    mapping(uint64 => Record[]) private recordsByNIK; 
    mapping(address => bool) public authorizedProviders;

    event RecordAdded(uint16 recordIndex, uint256 timestamp, bool isPaid);
    event ProviderAuthorized(address provider);
    event ProviderRemoved(address provider);
    event RecordPaymentUpdated(uint64 nik, uint16 recordIndex, bool isPaid);

    error OnlyAdmin();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Only authorized providers can perform this action");
        _;
    }

    modifier onlyAllowedContract() {
        require(msg.sender == allowedContract, "Caller is not the allowed contract");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setAllowedContract(address contractAddress) external onlyAdmin {
        allowedContract = contractAddress;
    }

    function authorizeProvider(address provider) external onlyAdmin {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    function removeProvider(address provider) external onlyAdmin {
        authorizedProviders[provider] = false;
        emit ProviderRemoved(provider);
    }

    function addRecord(uint64 nik, string memory encryptedData) public onlyAuthorizedProvider {
        uint16 recordIndex = uint16(recordsByNIK[nik].length);
        recordsByNIK[nik].push(Record({
            encryptedData: encryptedData,
            provider: msg.sender,
            timestamp: block.timestamp,
            isPaid: false // Default to unpaid when added
        }));
        
        emit RecordAdded(recordIndex, block.timestamp, false);
    }

    function updateRecordPaymentStatus(uint64 nik, uint16 recordIndex, bool isPaid) 
        public 
        onlyAllowedContract 
    {
        require(recordIndex < recordsByNIK[nik].length, "Invalid record index");
        recordsByNIK[nik][recordIndex].isPaid = isPaid;

        emit RecordPaymentUpdated(nik, recordIndex, isPaid);
    }

    function getRecords(uint64 nik) public view onlyAuthorizedProvider returns (Record[] memory) {
        return recordsByNIK[nik];
    }

    function getRecordCount(uint64 nik) public view onlyAuthorizedProvider returns (uint256) {
        return recordsByNIK[nik].length;
    }
}
