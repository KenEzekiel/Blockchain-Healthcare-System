// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriceOracle {
    uint256 public premiumPrice;
    uint256 public claimPrice;
    address public owner;

    event PremiumUpdated(uint256 oldData, uint256 newData);
    event ClaimUpdated(uint256 oldData, uint256 newData);

    // event GetPremiumPrice(uint256 price);
    // event GetClaimPrice(uint256 price);

    constructor(uint256 initialPremiumPrice, uint256 initialClaimPrice) {
        premiumPrice = initialPremiumPrice;
        claimPrice = initialClaimPrice;
        owner = msg.sender;
    }

    // Function to get the external data (this is like an oracle feed)
    function getPremiumPrice() external view returns (uint256) {
        // emit GetPremiumPrice(premiumPrice);
        return premiumPrice;
    }

    function getClaimPrice() external view returns (uint256) {
        // emit GetClaimPrice(claimPrice);
        return claimPrice;
    }

    // Function to update the data (simulating pulling from an external source)
    function setPremiumPrice(uint256 newData) external {
        require(msg.sender == owner, "Only owner can update the data");
        uint256 oldPremium = premiumPrice;
        premiumPrice = newData;
        emit PremiumUpdated(oldPremium, premiumPrice);
    }

    function setClaimPrice(uint256 newData) external {
        require(msg.sender == owner, "Only owner can update the data");
        uint256 oldClaim = claimPrice;
        claimPrice = newData;
        emit PremiumUpdated(oldClaim, claimPrice);
    }

    // Function to receive Ether
    receive() external payable {}
}
