import Web3 from "web3";
import axios from "axios";

// Connect to Ethereum node (replace with your Infura/Alchemy endpoint or local RPC)
const web3 = new Web3("http://127.0.0.1:8545"); // Example using local RPC

// DummyOracle contract details
const oracleAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1"; // Replace with the actual address of your deployed DummyOracle
const oracleABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialPremiumPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "initialClaimPrice",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldData",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newData",
        type: "uint256",
      },
    ],
    name: "ClaimUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldData",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newData",
        type: "uint256",
      },
    ],
    name: "PremiumUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "claimPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getClaimPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPremiumPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "premiumPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newData",
        type: "uint256",
      },
    ],
    name: "setClaimPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newData",
        type: "uint256",
      },
    ],
    name: "setPremiumPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

// Initialize contract
const oracleContract = new web3.eth.Contract(oracleABI, oracleAddress);

// The account that will interact with the contract (replace with your account address)
const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with the account you want to use for transactions

// Private key for signing the transaction (DO NOT hardcode in production)
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with your private key

// Set up web3 account for signing transactions
const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(accountFrom);
web3.eth.defaultAccount = accountFrom.address;

// Function to update the oracle with new data
async function updateOracleData(newPremium, newClaim) {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate1 = await oracleContract.methods
      .setPremiumPrice(newPremium)
      .estimateGas({ from: accountFrom.address });

    const gasEstimate2 = await oracleContract.methods
      .setClaimPrice(newClaim)
      .estimateGas({ from: accountFrom.address });

    const tx1 = await oracleContract.methods.setPremiumPrice(newPremium).send({
      from: accountFrom.address,
      gas: gasEstimate1,
      gasPrice: gasPrice,
    });

    const tx2 = await oracleContract.methods.setClaimPrice(newClaim).send({
      from: accountFrom.address,
      gas: gasEstimate2,
      gasPrice: gasPrice,
    });

    console.log(
      "Oracle data updated:",
      tx1.transactionHash,
      tx2.transactionHash
    );
  } catch (error) {
    console.error("Error updating oracle data:", error);
  }
}

// Function to fetch external data (e.g., from an API or generate dummy data)
async function fetchExternalData() {
  try {
    const random = Math.floor(Math.random() * 10); //generate random number between 0-99

    const newPremium = BigInt("1000000000000000000") + BigInt(random);
    const newClaim = BigInt("2000000000000000000") + BigInt(random);

    console.log(
      "Fetched new data:",
      newPremium.toString(),
      newClaim.toString()
    );
    return [newPremium, newClaim];
  } catch (error) {
    console.error("Error fetching external data:", error);
    return null;
  }
}

// Periodically update the oracle with new data
async function updateOraclePeriodically() {
  const newData = await fetchExternalData();
  if (newData !== null) {
    await updateOracleData(newData[0], newData[1]);
  }
}

// Run the update function every 30 seconds (or adjust as needed)
setInterval(updateOraclePeriodically, 30000); // 30 seconds
// console.log(fetchExternalData());
