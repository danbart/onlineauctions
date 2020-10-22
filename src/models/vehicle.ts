export class ModelVehicle {
  id_vehicle: number;
  model: string;
  mileage: string;
  colour: string;
  transmission: string;
  cylinders: string;
  fuel: string;
  revolutions: number;
  motor: number;
  vin: string;
  keys: boolean;
  sold: string;
  description: string;
  id_type: number;
  id_state: number;
  id_user: number;
  id_body_style: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_vehicle = 0;
    this.id_type = 0;
    this.id_user = 0;
    this.id_state = 0;
    this.id_body_style = 0;
    this.model = "";
    this.mileage = "";
    this.colour = "";
    this.transmission = "";
    this.cylinders = "";
    this.fuel = "";
    this.revolutions = 0;
    this.motor = 0;
    this.vin = "";
    this.keys = false;
    this.sold = "";
    this.description = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
