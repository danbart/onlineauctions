export class ModelCreditCard {
  id_credit_cart: number;
  id_account: number;
  card_number: string;
  expiration_date: string;
  cvc_code: string;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_credit_cart = 0;
    this.id_account = 0;
    this.card_number = "";
    this.expiration_date = "";
    this.cvc_code = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
