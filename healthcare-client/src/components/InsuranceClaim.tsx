import { useWeb3 } from "@/context/Web3Context";
import { claim, isActive } from "@/eth/app";
import { useState } from "react";
import { Box, Text, VStack, List, ListItem, RecipePropsProvider} from "@chakra-ui/react";
import { useForm, SubmitHandler, get } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { MedicalRecordReturn, MedicalRecordsRepository } from "@/repository/MedicalRecordsRepository";
import { Field } from "@/components/ui/field";
import { Stack, Input, Button } from "@chakra-ui/react";

// Define the dictionary for account mapping (nik: address mapping)
interface Dictionary<T> {
  [key: string]: T;
}

interface NikInput {
  nik: string;
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
  const [medicalrecords, setMedrecords] = useState<MedicalRecordReturn[]>([]); // Store fetched records
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordReturn | null>(null); // Store the selected record
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Store the selected record index

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<NikInput>();

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
        selectedRecord.provider,
        selectedRecord.nik.toString(),
        selectedIndex
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
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    const nik = Number(getValues("nik"));
    // const nik = Number(accountMapping[account!]);
    console.log("nik", nik);
    // Fetch medical records for the given NIK
    // const records = getMedRec(web3!, nik);

    const medicalRecordsRepository = new MedicalRecordsRepository(import.meta.env.VITE_SECRET_KEY!);
    const records = medicalRecordsRepository.getRecords(nik);

    records
      .then((recordsData: MedicalRecordReturn[]) => {
        if (recordsData.length === 0) {
          alert("No records found for the given NIK.");
        }
        setMedrecords(recordsData);
        console.log(recordsData);
      })
      .catch((error) => {
        console.error("Failed to fetch medical records:", error);
      });
    console.log(records);
  };

  // Handle selecting a medical record
  const handleSelectRecord = (record: any, index: number) => {
    setSelectedIndex(index); 
    setSelectedRecord(record); 
    toaster.create({
      title: "Record Selected",
      type: "info",
      description: `You have selected the record for NIK: ${record.nik}`,
    });
  };

  return (
    <Box p={5} borderRadius="md" bg="white">
      <VStack align="start">
        <Stack mb={6}>
          <form>
            <Field label="NIK">
              <Input
                type="nik"
                defaultValue={1234567890123456}
                {...register("nik", {
                  required: "NIK is required",
                  pattern: {
                      value: /^[0-9]+$/, // Ensure only numbers
                      message: "NIK must be a valid integer",
                  },
                  validate: {
                      length: (value) =>
                          value.length === 16 || "NIK must be equal to 16 digits",
                  },
              })}
              />
            </Field>
            <Button onClick={getMedrec}>
              Get Medical Records
            </Button>
          </form>
        </Stack>  
          {/* <Button colorScheme="blue" onClick={getMedrec}>
            Get Medical Records
          </Button> */}

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
