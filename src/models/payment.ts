export class ModelPayment {
  id_payment: number;
  id_user_seller: number;
  id_user_buyer: number;
  amount: number;
  paid_type: string;
  discount: number;
  tax: number;
  sold: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_payment = 0;
    this.id_user_buyer = 0;
    this.id_user_seller = 0;
    this.amount = 0;
    this.paid_type = "";
    this.discount = 0;
    this.tax = 0;
    this.sold = 0;
    this.created_at = "";
    this.updated_at = "";
  }
}
