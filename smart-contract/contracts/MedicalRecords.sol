// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MedicalRecords {
    address public admin;

    struct Record {
       string encryptedData;
       address provider;
       uint256 timestamp;
    }

    mapping(string => Record[]) private recordsByNIK; 
    mapping(address => bool) public authorizedProviders;

    event RecordAdded(string indexed nik, address indexed provider, uint256 timestamp);
    event ProviderAuthorized(address indexed provider);
    event ProviderRemoved(address indexed provider);

     modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Only authorized providers can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
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
        recordsByNIK[nik].push(Record({
            encryptedData: encryptedData,
            provider: msg.sender,
            timestamp: block.timestamp
        }));

        emit RecordAdded(nik, msg.sender, block.timestamp);
    }

    function getRecords(string memory nik) public view onlyAuthorizedProvider returns (Record[] memory) {
        return recordsByNIK[nik];
    }

    function getRecordCount(string memory nik) public view onlyAuthorizedProvider returns (uint256) {
        return recordsByNIK[nik].length;
    }
}