import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
// import { setupContractEventListeners } from "../eth/app";

export const LOCAL_CHAIN_ID = "0x7A69";
const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export function useWeb3() {
  const { sdk, ...sdkRelated } = useSDK();
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  const handleContractEvent = useCallback(
    (eventName: string, data: unknown) => {
      console.log(eventName, data);
    },
    []
  );

  async function connect() {
    try {
      // Check SDK availability
      if (!sdk) {
        console.error("SDK is not available!");
        return;
      }

      // Get account from SDK
      const accounts = await sdk.connect();
      if (!accounts || accounts.length === 0) {
        console.error("No accounts available!");
        return;
      }

      // Attempt to connect to local chain
      try {
        await sdkRelated.provider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: LOCAL_CHAIN_ID }],
        });
      } catch (e) {
        // Error code indicates that the chain has not been added to Metamask
        // @ts-expect-error: e should have code, as it is a known error from the sdk, but the ts does not recognize it
        if (e.code === 4902) {
          // Try adding the chain
          try {
            await sdkRelated.provider?.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: LOCAL_CHAIN_ID,
                  chainName: "LocalChain 8545",
                  rpcUrls: [LOCAL_RPC_URL],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            });
          } catch (addError) {
            console.error("Error adding the local chain:", addError);
            return;
          }
        } else {
          console.error("Failed to switch to local chain:", e);
          return;
        }
      }

      // Connection successful
      setAccount(accounts[0]);
      console.log("Connection successful!");

      // Set the web3 instance to be returned
      const web3Instance = new Web3(LOCAL_RPC_URL);
      setWeb3(web3Instance);

      // Additional logic here
    } catch (e) {
      console.error("Connection error:", e);
    }
  }

  // Disconnect from the local chain
  async function disconnect() {
    try {
      await sdk?.disconnect();
      setAccount(null);
      setWeb3(null);
      console.log("Disconnected successfully!");
    } catch (e) {
      console.error("Disconnection error:", e);
    }
  }

  // Setup contract event listeners
  useEffect(() => {
    if (web3) {
      // setupContractEventListeners(web3, handleContractEvent);
    }
  }, [web3, handleContractEvent]);

  // Return the results
  return { account, connect, disconnect, web3 };
}
