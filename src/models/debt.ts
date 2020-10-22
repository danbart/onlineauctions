export class ModelDebt {
  id_debt: number;
  id_account: number;
  amount: number;
  reason: string;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_debt = 0;
    this.id_account = 0;
    this.amount = 0;
    this.reason = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
