export class MedicalInsurance {
  private static instance: MedicalInsurance;
  public nik: string;
  public recordIndex: number;

  private constructor() {
    this.nik = "";
    this.recordIndex = 0;
  }

  public static getInstance(): MedicalInsurance {
    if (!MedicalInsurance.instance) {
      MedicalInsurance.instance = new MedicalInsurance();
    }
    return MedicalInsurance.instance;
  }
}
