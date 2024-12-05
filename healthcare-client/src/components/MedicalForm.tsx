// MedicalForm.tsx
import { Stack, Input, Button } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";

interface MedicalFormInputs {
  tanggalPengecekan: string;
  penyediaLayananKesehatan: string;
  nik: string;
  nama: string;
  diagnosa: string;
  tindakan: string;
}

export const MedicalForm = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalFormInputs>();

  const onSubmit: SubmitHandler<MedicalFormInputs> = (data) => {
    console.log("Medical Form Data:", data, errors);
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
