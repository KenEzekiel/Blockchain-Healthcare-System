import { Stack, Input, Button, HStack, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { isActive } from "@/eth/app";
import { useWeb3 } from "@/context/Web3Context";

interface InsuranceCheckInputs {
  month: string;
  nik: number;
}

export const InsuranceCheck = () => {
  const { web3, account } = useWeb3();
  const [insuranceActive, setInsuranceActive] = useState(false);
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  const [monthstring] = useState<string>(currentMonth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsuranceCheckInputs>();

  const onSubmit: SubmitHandler<InsuranceCheckInputs> = async (data) => {
    console.log("Insurance Form Data:", data, errors);
    updateInsuranceActive(data.nik);
  };

  async function updateInsuranceActive(nik: number) {
    if (web3 && account && currentMonth) {
      setInsuranceActive(
        await isActive(
          web3,
          nik,
          currentMonth.split("-")[0] as unknown as number,
          currentMonth.split("-")[1] as unknown as number
        )
      );
    } else {
      console.log(
        "update insurance failed",
        web3,
        nik,
        currentMonth.split("-")[0] as unknown as number,
        currentMonth.split("-")[1] as unknown as number
      );
    }
  }

  return (
    <Stack mb={6}>
      <HStack>
        <Text mb={4} fontSize="lg">
          Premi Asuransi {monthstring}:
        </Text>
        <Text mb={4} color="green.600" fontWeight="bold">
          {insuranceActive ? "AKTIF" : ""}
        </Text>
        <Text mb={4} color="red.600" fontWeight="bold">
          {insuranceActive ? "" : "TIDAK AKTIF"}
        </Text>
      </HStack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field label="Month">
          <Input
            type="month"
            defaultValue={currentMonth}
            {...register("month")}
          />
        </Field>
        <Field label="NIK yang akan dicek">
          <Input
            type="nik"
            defaultValue={0}
            {...register("nik", { required: true })}
          />
        </Field>

        <Button
          type="submit"
          mt={4}
          colorScheme="green"
          // onClick={updateInsuranceActive}
        >
          Check Insurance
        </Button>
      </form>
    </Stack>
  );
};
