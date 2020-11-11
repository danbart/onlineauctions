export class ModelAuctioned {
  id_auctioned: number;
  id_auction: number;
  amount: number;
  id_user: number;
  description: string;
  cancelled: string;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_auctioned = 0;
    this.id_auction = 0;
    this.id_user = 0;
    this.amount = 0;
    this.description = "";
    this.cancelled = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
