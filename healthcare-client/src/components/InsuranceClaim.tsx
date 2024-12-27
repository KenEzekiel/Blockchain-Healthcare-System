import { useWeb3 } from "@/context/Web3Context";
import { claim, isActive } from "@/eth/app";
import { getMedRec } from "@/eth/app";
import { useState } from "react";
import { Button, Box, Text, VStack, List, ListItem } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

// Define the dictionary for account mapping (nik: address mapping)
interface Dictionary<T> {
  [key: string]: T;
}

const accountMapping: Dictionary<string> = {
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266": "1",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8": "2",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc": "3",
};

// for layanan kesehatan account
const layananKesehatanAddress = {
  // penyedia : address
  "1": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "2": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
};

export const InsuranceClaim = () => {
  const { web3, account } = useWeb3();
  const [medicalrecords, setMedrecords] = useState<any[]>([]); // Store fetched records
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null); // Store the selected record

  const startClaim = async () => {
    if (!selectedRecord) {
      toaster.create({
        type: "error",
        description: "Please select a medical record to claim.",
      });
      return;
    }

    const isInsuranceActive = await isActive(
      web3!,
      account!,
      selectedRecord.checkupDate.split("-")[0] as unknown as number,
      selectedRecord.checkupDate.split("-")[1] as unknown as number
    );

    if (isInsuranceActive) {
      // If insurance is active, proceed with claim
      claim(
        web3!,
        selectedRecord.checkupDate.split("-")[0] as unknown as number,
        selectedRecord.checkupDate.split("-")[1] as unknown as number,
        layananKesehatanAddress[selectedRecord.healthcareProvider],
        selectedRecord.nik,
        selectedRecord.recordIndex
      );
      toaster.create({
        type: "info",
        description: "Your claim has been successfully started.",
      });
      console.log("claim started");
    } else {
      toaster.create({
        type: "info",
        description:
          "The selected insurance record is not active for the specified period.",
      });
      console.log("insurance inactive!");
    }
  };

  const getMedrec = () => {
    if (!account) return;

    const nik = accountMapping[account!];
    console.log("nik", nik);
    // Fetch medical records for the given NIK
    const records = getMedRec(web3!, nik);

    // Assuming the getMedRec function returns a promise and an array of records
    records
      .then((recordsData: any[]) => {
        setMedrecords(recordsData); // Set the fetched records in state
        console.log(recordsData);
      })
      .catch((error) => {
        console.error("Failed to fetch medical records:", error);
      });
    console.log(records);
  };

  // Handle selecting a medical record
  const handleSelectRecord = (record: any, index: number) => {
    record.recordIndex = index;
    setSelectedRecord(record); // Set the selected record in state
    toaster.create({
      title: "Record Selected",
      type: "info",
      description: `You have selected the record for NIK: ${record.nik}`,
    });
  };

  return (
    <Box p={5} borderRadius="md" bg="white">
      <VStack align="start">
        <Button colorScheme="blue" onClick={getMedrec}>
          Get Medical Records
        </Button>

        {/* Display medical records */}
        {medicalrecords.length > 0 ? (
          <List.Root w="full">
            {medicalrecords.map((record, index) => (
              <List.Item
                key={index}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                boxShadow="sm"
              >
                <VStack align="start">
                  <Text fontWeight="bold">
                    Healthcare Provider: {record.healthcareProvider}
                  </Text>
                  <Text>NIK: {record.nik}</Text>
                  <Text>Diagnosis: {record.diagnosis}</Text>
                  <Text>Treatment: {record.treatment}</Text>
                  <Text>Checkup Date: {record.checkupDate}</Text>
                  <Text>Provider: {record.provider}</Text>
                  <Text>Payment: {record.isPaid ? "TRUE" : "FALSE"}</Text>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleSelectRecord(record, index)}
                  >
                    Select this Record
                  </Button>
                </VStack>
              </List.Item>
            ))}
          </List.Root>
        ) : (
          <Text>No records found. Please fetch the records first.</Text>
        )}

        {/* Start Claim Button */}
        <Button
          colorScheme="green"
          onClick={startClaim}
          disabled={!selectedRecord}
        >
          Start Claim
        </Button>
      </VStack>
    </Box>
  );
};
