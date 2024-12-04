import Web3 from "web3";

// const CONTRACT_ADDRESS_1 = "";

export async function getGasPrice(web3: Web3) {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    console.log("Current gas price:", gasPrice);
    return gasPrice;
  } catch (error) {
    console.error("Error getting gas price:", error);
    throw error;
  }
}
