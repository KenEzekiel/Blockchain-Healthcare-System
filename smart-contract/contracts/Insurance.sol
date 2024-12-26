// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
        uint256 medrecIdentifier
    );
    event SetPremium(uint256 oldAmount, uint256 newAmount);

    // STORAGE

    IERC20 public medicalToken;

    // Premium in terms of your token’s smallest unit. (wei-like)
    // For example, if the MedicalToken has 18 decimals,
    // then "1 * 10^18" represents 1 token.
    uint256 public premiumAmount;

    // Store active months per user in a mapping:
    // userAddress => (month => bool)
    mapping(address => mapping(uint256 => mapping(uint256 => bool)))
        private _activeMonthYear;

    // For demonstration, define a fixed claim amount (in tokens).
    uint256 public claimAmount;

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
        uint256 _premiumAmount,
        uint256 _claimAmount
    ) {
        owner = msg.sender;
        medicalToken = IERC20(_medicalTokenAddress);
        premiumAmount = _premiumAmount;
        claimAmount = _claimAmount;
    }

    // PUBLIC FUNCTIONS
    /**
     * @dev Pay the premium for the given (month, year) using MedicalToken.
     *      The user must first approve the contract to spend their tokens.
     * @param month The month for which the user is paying the premium (1-12).
     * @param year  The year for which the user is paying the premium (e.g. 2024).
     */
    function payPremium(uint256 month, uint256 year) external {
        require(month >= 1 && month <= 12, "Month must be 1-12");
        require(year > 0, "Year must be nonzero");
        require(
            medicalToken.balanceOf(msg.sender) >= premiumAmount,
            "Insufficient token balance"
        );
        require(
            medicalToken.allowance(msg.sender, address(this)) >= premiumAmount,
            "Insufficient token allowance"
        );

        // Transfer tokens from user to contract
        bool success = medicalToken.transferFrom(
            msg.sender,
            address(this),
            premiumAmount
        );
        require(success, "Token transfer failed");

        // Mark user as active for this (year, month)
        _activeMonthYear[msg.sender][year][month] = true;

        emit PremiumPaid(msg.sender, year, month, premiumAmount);
    }

    /**
     * @dev Check if a user is active in a given (month, year).
     * @param user  Address of the user to check.
     * @param month Month to check (1-12).
     * @param year  Year to check.
     * @return Boolean indicating whether the user is active for (month, year).
     */
    function isActive(
        address user,
        uint256 year,
        uint256 month
    ) external view returns (bool) {
        return _activeMonthYear[user][year][month];
    }

    /**
     * @dev Claim insurance for a specific (month, year). Requires the user to be active.
     * @param month The month for which the user wants to claim.
     * @param year  The year for which the user wants to claim.
     * @param provider The health provider that will receive the payment from the claim
     */
    function claim(uint256 year, uint256 month, address provider) external {
        require(year > 0, "Year must be nonzero");
        require(month >= 1 && month <= 12, "Month must be 1-12");
        require(
            _activeMonthYear[msg.sender][year][month],
            "Not active for this month/year"
        );

        // Check if contract has enough tokens to pay out the claim.
        require(
            medicalToken.balanceOf(address(this)) >= claimAmount,
            "Insufficient contract token balance"
        );

        bool success = medicalToken.transfer(provider, claimAmount);
        require(success, "Claim transfer failed");

        emit Claimed(msg.sender, year, month, claimAmount, provider, 1);
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
