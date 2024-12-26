// InsuranceForm.tsx
import { Stack, Input, Button } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { useWeb3 } from "@/context/Web3Context";
import { payPremium } from "@/eth/app";

interface InsuranceFormInputs {
  month: string;
  insuranceType: string;
  premium: string;
}

export const InsuranceForm = () => {
  const { web3, account } = useWeb3();
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  async function submitPayment() {
    if (web3 && account && currentMonth) {
      payPremium(
        web3,
        currentMonth.split("-")[1] as unknown as number,
        currentMonth.split("-")[0] as unknown as number
      );
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsuranceFormInputs>();

  const onSubmit: SubmitHandler<InsuranceFormInputs> = (data) => {
    console.log("Insurance Form Data:", data, errors);
  };

  return (
    <Stack mb={6}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field label="Month">
          <Input
            type="month"
            defaultValue={currentMonth}
            {...register("month")}
          />
        </Field>

        <Button
          type="submit"
          mt={4}
          colorScheme="green"
          onClick={submitPayment}
        >
          Submit Insurance Form
        </Button>
      </form>
    </Stack>
  );
};
