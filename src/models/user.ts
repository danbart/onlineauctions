export class ModelUser {
  public id_user: number;
  public name: string;
  public last_name: string;
  public active: boolean;
  public avatar: string;
  public email: string;
  public password: string;
  public addres: string;
  public phone: string;
  public web_site: string;
  public facebook: string;
  public twitter: string;
  public remember_token: string;
  public created_at: string;
  public updated_at: string;

  constructor() {
    this.id_user = 0;
    this.name = "";
    this.last_name = "";
    this.active = true;
    this.avatar = "";
    this.email = "";
    this.addres = "";
    this.phone = "";
    this.web_site = "";
    this.facebook = "";
    this.twitter = "";
    this.remember_token = "";
    this.password = "";
    this.created_at = "";
    this.updated_at = "";
  }
}
