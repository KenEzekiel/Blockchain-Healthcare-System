// MedicalForm.tsx
import { Stack, Input, Button } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { addMedrec, claim, isActive } from "@/eth/app";
import { useWeb3 } from "@/context/Web3Context";
import { MedicalInsurance } from "@/modules/MedicalInsurance";

interface MedicalFormInputs {
  tanggalPengecekan: string;
  penyediaLayananKesehatan: string;
  nik: string;
  nama: string;
  diagnosa: string;
  tindakan: string;
}

// for user patient account
const accountMapping = {
  // nik : address
  "1": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "2": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "3": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
};

// for layanan kesehatan account
const layananKesehatanAddress = {
  // penyedia : address
  "1": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "2": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
};

export const MedicalForm = () => {
  const { web3, account } = useWeb3();
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalFormInputs>();

  const onSubmit: SubmitHandler<MedicalFormInputs> = (data) => {
    console.log("Medical Form Data:", data, errors);
    const recordIndex = addMedrec(
      web3!,
      data.tanggalPengecekan,
      data.penyediaLayananKesehatan,
      data.nik,
      data.nama,
      data.diagnosa,
      data.tindakan,
      account!
    );

    console.log(recordIndex);

    if (recordIndex !== null) {
      MedicalInsurance.getInstance().nik = data.nik;
      MedicalInsurance.getInstance().recordIndex = recordIndex;
    }

    reset();
  };

  return (
    <Stack mb={6}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field label="Tanggal Pengecekan">
          <Input
            type="date"
            defaultValue={formattedDate}
            {...register("tanggalPengecekan")}
          />
        </Field>

        <Field label="Penyedia Layanan Kesehatan">
          <Input
            type="text"
            placeholder="Penyedia Layanan Kesehatan"
            {...register("penyediaLayananKesehatan")}
          />
        </Field>

        <Field label="NIK">
          <Input type="number" placeholder="NIK" {...register("nik")} />
        </Field>

        <Field label="Nama">
          <Input type="text" placeholder="Nama lengkap" {...register("nama")} />
        </Field>

        <Field label="Diagnosa">
          <Input
            type="text"
            placeholder="Hasil Pemeriksaan"
            {...register("diagnosa")}
          />
        </Field>

        <Field label="Tindakan">
          <Input type="text" placeholder="Tindakan" {...register("tindakan")} />
        </Field>

        <Button type="submit" mt={4} colorScheme="blue">
          Submit Medical Form
        </Button>
      </form>
    </Stack>
  );
};
