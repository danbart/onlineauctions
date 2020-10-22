export class ModelCredit {
  id_credit: number;
  id_account: number;
  amount: number;
  reason: string;
  paid_type: string;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_credit = 0;
    this.id_account = 0;
    this.amount = 0;
    this.reason = "";
    this.paid_type = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
