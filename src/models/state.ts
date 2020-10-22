export class ModelState {
  id_state: number;
  state: string;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_state = 0;
    this.state = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
