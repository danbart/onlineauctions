export class ModelCompany {
  id_company: number;
  name: string;
  email: string;
  phone: string;
  addres: string;
  logo: string;
  mission: string;
  vision: string;
  values: string;
  maximum_profit: number;
  minimum_profit: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_company = 0;
    this.name = "";
    this.email = "";
    this.phone = "";
    this.addres = "";
    this.logo = "";
    this.mission = "";
    this.vision = "";
    this.values = "";
    this.maximum_profit = 5;
    this.minimum_profit = 3;
    this.created_at = "";
    this.updated_at = "";
  }
}
