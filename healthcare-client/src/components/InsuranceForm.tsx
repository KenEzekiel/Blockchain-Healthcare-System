// InsuranceForm.tsx
import { Stack, Input, Button } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { useWeb3 } from "@/context/Web3Context";
import {
  getPremiumAmount,
  getTokenBalance,
  getTokenContract,
  INSURANCE_CONTRACT_ADDRESS,
  payPremium,
} from "@/eth/app";

interface InsuranceFormInputs {
  month: string;
  insuranceType: string;
  premium: string;
  nik: number;
}

export const InsuranceForm = () => {
  const { web3, account } = useWeb3();
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  async function submitPayment(nik: number) {
    if (web3 && account && currentMonth) {
      const tokenContract = getTokenContract(web3);

      const premiumAmount = await getPremiumAmount(web3);

      const balance = await getTokenBalance(web3, account);
      console.log(premiumAmount, account, balance);

      await tokenContract!.methods
        .approve(INSURANCE_CONTRACT_ADDRESS, premiumAmount * 100)
        .send({ from: account });

      const allowance = await tokenContract!.methods
        .allowance(account, INSURANCE_CONTRACT_ADDRESS)
        .call();

      console.log("allowance", allowance);
      payPremium(
        web3,
        currentMonth.split("-")[1] as unknown as number,
        currentMonth.split("-")[0] as unknown as number,
        nik
      );
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsuranceFormInputs>();

  const onSubmit: SubmitHandler<InsuranceFormInputs> = async (data) => {
    console.log("Insurance Form Data:", data, errors);
    await submitPayment(data.nik);
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
        <Field label="NIK yang akan diasuransikan">
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
          // onClick={submitPayment}
        >
          Submit Insurance Form
        </Button>
      </form>
    </Stack>
  );
};
