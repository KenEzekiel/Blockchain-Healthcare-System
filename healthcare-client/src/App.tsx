import { Box, Text, Button, Stack, HStack, Container } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import { useWeb3 } from "./hooks/useWeb3";
import { MedicalForm } from "./components/MedicalForm";
import { InsuranceForm } from "./components/InsuranceForm";
import { InsuranceCheck } from "./components/InsuranceCheck";
// import { getGasPrice } from "./eth/app";

function App() {
  const { account, connect, disconnect, web3 } = useWeb3();
  const [gasPriceTime, setGasPriceTime] = useState(0);

  const [isAdmin, setIsAdmin] = useState(false);

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

  function switchAdmin() {
    setIsAdmin(!isAdmin);
  }

  return (
    <Container>
      {/* Gas Price Display */}
      <Text mb={4} fontSize="lg">
        Current Gas Price: {gasPriceTime} Gwei
      </Text>
      {/* Web3 Controls */}
      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
        {account ? (
          <>
            <Text>Account: {account}</Text>
            <Button onClick={disconnect} colorScheme="red">
              Logout
            </Button>
            <Button onClick={updateGasPriceTime} colorScheme="purple">
              Update Gas Price
            </Button>
            <Button onClick={switchAdmin}>Admin</Button>
          </>
        ) : (
          <Button onClick={connect} colorScheme="teal">
            Login
          </Button>
        )}
      </Box>
      <HStack>
        <Box p={4} alignContent="center" width="lg">
          {/* Medical Checkup */}
          {isAdmin ? (
            <>
              <Text mb={4} fontWeight="bold">
                Medical Checkup
              </Text>
              <MedicalForm></MedicalForm>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box p={4} w="lg">
          {/* Insurance */}
          <Text mb={4} fontWeight="bold">
            Insurance
          </Text>
          <Stack>
            <InsuranceForm></InsuranceForm>
            <InsuranceCheck></InsuranceCheck>
          </Stack>
        </Box>
      </HStack>
    </Container>
  );
}

export default App;
