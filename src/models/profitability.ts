export class ModelProfitability {
  id_profitability: number;
  profit: number;
  amount: number;
  id_payment: number;
  id_company: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_profitability = 0;
    this.profit = 0;
    this.amount = 0;
    this.id_payment = 0;
    this.id_company = 0;
    this.created_at = "";
    this.updated_at = "";
  }
}
