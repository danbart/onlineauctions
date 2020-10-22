export class ModelAccount {
  id_account: number;
  id_user: number;
  active: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id_account = 0;
    this.id_user = 0;
    this.active = "";
    this.deleted_at = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
