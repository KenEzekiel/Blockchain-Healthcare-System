// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MedicalRecords.sol";

interface IOracle {
    function getPremiumPrice() external view returns (uint256);

    function getClaimPrice() external view returns (uint256);
}

contract Insurance {
    // EVENTS

    event PremiumPaid(
        address indexed user,
        uint256 year,
        uint256 month,
        uint256 amount
    );
    event Claimed(
        address indexed user,
        uint256 year,
        uint256 month,
        uint256 claimAmount,
        address indexed provider,
        uint64 nik,
        uint16 recordIndex
    );
    event SetPremium(uint256 oldAmount, uint256 newAmount);

    // STORAGE
    MedicalRecords medicalRecords;
    IERC20 public medicalToken;
    IOracle public priceOracle;

    uint256 public premiumAmount; // Premium amount, set by oracle
    uint256 public claimAmount; // Claim amount, set by oracle

    // Store active months per user in a mapping:
    // userAddress => (month => bool)
    mapping(uint64 => mapping(uint256 => mapping(uint256 => bool)))
        private _activeMonthYear;

    // Owner of the contract
    address public owner;

    // MODIFIER
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // CONSTRUCTOR
    constructor(
        address _medicalTokenAddress,
        address _oracleAddress,
        address _medicalRecordContractAddress
    ) {
        owner = msg.sender;
        medicalToken = IERC20(_medicalTokenAddress);
        priceOracle = IOracle(_oracleAddress);
        medicalRecords = MedicalRecords(_medicalRecordContractAddress);
    }

    // PUBLIC FUNCTIONS
    /**
     * @dev Pay the premium for the given (month, year) using MedicalToken.
     *      The user must first approve the contract to spend their tokens.
     * @param month The month for which the user is paying the premium (1-12).
     * @param year  The year for which the user is paying the premium (e.g. 2024).
     */
    function payPremium(
        uint64 nik,
        uint256 month, 
        uint256 year
    ) external {
        uint256 currentPremium = priceOracle.getPremiumPrice();
        require(month >= 1 && month <= 12, "Month must be 1-12");
        require(year > 0, "Year must be nonzero");
        require(
            medicalToken.balanceOf(msg.sender) >= currentPremium,
            "Insufficient token balance"
        );
        require(
            medicalToken.allowance(msg.sender, address(this)) >= currentPremium,
            "Insufficient token allowance"
        );

        // Mark user as active for this (year, month)
        _activeMonthYear[nik][year][month] = true;
        emit PremiumPaid(msg.sender, year, month, currentPremium);

        // Transfer tokens from user to contract
        bool success = medicalToken.transferFrom(
            msg.sender,
            address(this),
            currentPremium
        );
        require(success, "Token transfer failed");
    }

    function isActive(
        uint64 nik,
        uint256 year,
        uint256 month
    ) external view returns (bool) {
        return _activeMonthYear[nik][year][month];
    }

    // function changePaymentStatus(
    //     string memory nik,
    //     uint256 recordIndex,
    //     bool isPaid
    // ) external {
    //     medicalRecords.updateRecordPaymentStatus(nik, recordIndex, isPaid);
    // }

    /**
     * @dev Claim insurance for a specific (month, year). Requires the user to be active.
     * @param month The month for which the user wants to claim.
     * @param year  The year for which the user wants to claim.
     * @param provider The health provider that will receive the payment from the claim
     */
    function claim(
        uint256 year,
        uint256 month,
        address provider,
        uint64 nik,
        uint16 recordIndex
    ) external {
        uint256 currentClaim = priceOracle.getClaimPrice();
        require(year > 0, "Year must be nonzero");
        require(month >= 1 && month <= 12, "Month must be 1-12");
        require(
            _activeMonthYear[nik][year][month],
            "Not active for this month/year"
        );

        // Check if contract has enough tokens to pay out the claim.
        require(
            medicalToken.balanceOf(address(this)) >= currentClaim,
            "Insufficient contract token balance"
        );


        medicalRecords.updateRecordPaymentStatus(nik, recordIndex, true);

        emit Claimed(
            msg.sender,
            year,
            month,
            currentClaim,
            provider,
            nik,
            recordIndex
        );
        bool success = medicalToken.transfer(provider, currentClaim);
        require(success, "Claim transfer failed");
    }

    // ADMIN FUNCTIONS
    /**
     * @dev Set a new premium amount (in the token's smallest unit).
     * @param newAmount New premium amount.
     */
    function setPremiumAmount(uint256 newAmount) external onlyOwner {
        uint256 oldAmount = premiumAmount;
        premiumAmount = newAmount;
        emit SetPremium(oldAmount, newAmount);
    }

    /**
     * @dev Set a new claim amount (in the token's smallest unit).
     * @param newClaimAmount New claim amount.
     */
    function setClaimAmount(uint256 newClaimAmount) external onlyOwner {
        claimAmount = newClaimAmount;
    }

    /**
     * @dev Withdraw any tokens from the contract to the owner address.
     * @param amount The amount to withdraw (in the token's smallest unit).
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(
            medicalToken.balanceOf(address(this)) >= amount,
            "Not enough tokens in contract"
        );

        bool success = medicalToken.transfer(msg.sender, amount);
        require(success, "Withdrawal failed");
    }
}
