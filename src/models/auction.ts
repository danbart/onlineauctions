export class ModelAuction {
  id_auction: number;
  auction_date: string;
  initial_amount: number;
  increased_amount: number;
  increased_supply: number;
  sold: number;
  desciption: string;
  finished: string;
  active: string;
  id_vehicle: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_auction = 0;
    this.id_vehicle = 0;
    this.auction_date = "";
    this.initial_amount = 0;
    this.increased_amount = 0;
    this.increased_supply = 0;
    this.sold = 0;
    this.desciption = "";
    this.finished = "";
    this.active = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
