// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MedicalRecords {
    address public admin;
    address public allowedContract; // Whitelisted contract address

    struct Record {
        string encryptedData;
        address provider;
        uint256 timestamp;
        bool isPaid; // Flag to track payment status
    }

    mapping(string => Record[]) private recordsByNIK; 
    mapping(address => bool) public authorizedProviders;

    event RecordAdded(uint256 recordIndex, uint256 timestamp, bool isPaid);
    event ProviderAuthorized(address indexed provider);
    event ProviderRemoved(address indexed provider);
    event RecordPaymentUpdated(string indexed nik, uint256 indexed recordIndex, bool isPaid);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
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

    function authorizeProvider(address provider) public onlyAdmin {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    function removeProvider(address provider) public onlyAdmin {
        authorizedProviders[provider] = false;
        emit ProviderRemoved(provider);
    }

    function addRecord(string memory nik, string memory encryptedData) public onlyAuthorizedProvider {
        uint256 recordIndex = recordsByNIK[nik].length;
        recordsByNIK[nik].push(Record({
            encryptedData: encryptedData,
            provider: msg.sender,
            timestamp: block.timestamp,
            isPaid: false // Default to unpaid when added
        }));
        
        emit RecordAdded(recordIndex, block.timestamp, false);
    }

    function updateRecordPaymentStatus(string memory nik, uint256 recordIndex, bool isPaid) 
        public 
        onlyAllowedContract 
    {
        require(recordIndex < recordsByNIK[nik].length, "Invalid record index");
        recordsByNIK[nik][recordIndex].isPaid = isPaid;

        emit RecordPaymentUpdated(nik, recordIndex, isPaid);
    }

    function getRecords(string memory nik) public view onlyAuthorizedProvider returns (Record[] memory) {
        return recordsByNIK[nik];
    }

    function getRecordCount(string memory nik) public view onlyAuthorizedProvider returns (uint256) {
        return recordsByNIK[nik].length;
    }
}
