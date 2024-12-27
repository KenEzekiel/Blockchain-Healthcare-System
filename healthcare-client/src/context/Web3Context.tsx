import React, { createContext, useCallback, useContext, useState } from "react";
import Web3 from "web3";
import { useSDK } from "@metamask/sdk-react";
import { setupContractsEventListener } from "@/eth/app";

// Define the context shape
interface Web3ContextProps {
  web3: Web3 | null;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

// Web3 provider component
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { sdk, ...sdkRelated } = useSDK();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    if (!sdk) {
      console.error("SDK is not available!");
      return;
    }

    try {
      // Request account from MetaMask
      const accounts = await sdk.connect();
      if (!accounts || accounts.length === 0) {
        console.error("No accounts available!");
        return;
      }

      // Switch to the correct Ethereum chain (local chain in this case)
      try {
        await sdkRelated.provider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x7A69" }],
        });
      } catch (e) {
        // Error code indicates that the chain has not been added
        if (e.code === 4902) {
          try {
            await sdkRelated.provider?.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x7A69",
                  chainName: "LocalChain 8545",
                  rpcUrls: ["http://127.0.0.1:8545"],
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                },
              ],
            });
          } catch (addError) {
            console.error("Error adding local chain:", addError);
            return;
          }
        } else {
          console.error("Failed to switch to local chain:", e);
          return;
        }
      }

      setAccount(accounts[0]);
      const web3Instance = new Web3("http://127.0.0.1:8545");
      setWeb3(web3Instance);

      setupContractsEventListener(web3Instance);
    } catch (e) {
      console.error("Connection error:", e);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setWeb3(null);
    console.log("Disconnected from wallet");
  };

  return (
    <Web3Context.Provider value={{ web3, account, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
