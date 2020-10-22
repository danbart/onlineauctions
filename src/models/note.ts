export class ModelNote {
  id_note: number;
  note: string;
  id_vehicle: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_note = 0;
    this.note = "";
    this.id_vehicle = 0;
    this.created_at = "";
    this.updated_at = "";
  }
}
