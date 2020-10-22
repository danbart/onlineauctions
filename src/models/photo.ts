export class ModelPhoto {
  id_photo: number;
  photo: string;
  id_vehicle: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_photo = 0;
    this.id_vehicle = 0;
    this.photo = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
