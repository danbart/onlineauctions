export class ModelOpinion {
  id_opinion: number;
  id_user_opined: number;
  id_user_say: number;
  id_vehicle: number;
  opinion: string;
  rating: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_opinion = 0;
    this.id_user_opined = 0;
    this.id_user_say = 0;
    this.id_vehicle = 0;
    this.opinion = "";
    this.rating = 0;
    this.created_at = "";
    this.updated_at = "";
  }
}
