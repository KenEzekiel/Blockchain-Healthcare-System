import { Box, Text, Image, Input, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useWeb3 } from "./hooks/useWeb3";
// import { getGasPrice } from "./eth/app";

function App() {
  const [count, setCount] = useState(0);
  const { account, connect, disconnect, web3 } = useWeb3();
  const [gasPriceTime, setGasPriceTime] = useState(0);

  async function updateGasPriceTime() {
    if (web3) {
      try {
        // const price = await getGasPrice(web3);
        const price = await web3.eth.getGasPrice();
        setGasPriceTime(Number(price) / 1_000_000_000);
      } catch (e) {
        console.error("Failed to update gas price:", e);
      }
    }
  }

  return (
    <Box>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>{gasPriceTime} is gas Price</p>
      <Box marginLeft="auto" display="flex" alignItems="center">
        {account ? (
          <Box>Account: {account}</Box>
        ) : (
          <Button onClick={connect}>Login</Button>
        )}
      </Box>
      {account && (
        <Button onClick={disconnect} marginLeft={2}>
          Logout
        </Button>
      )}
      {account && (
        <Button onClick={updateGasPriceTime} marginLeft={2}>
          Update Gas Price
        </Button>
      )}
    </Box>
  );
}

export default App;
