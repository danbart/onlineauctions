export class ModelPasswordResets {
  id_password_resets: number;
  email: string;
  token: string;
  created_at: string;

  constructor() {
    this.id_password_resets = 0;
    this.email = "";
    this.token = "";
    this.created_at = "";
  }
}
