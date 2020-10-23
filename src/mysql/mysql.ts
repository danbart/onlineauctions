import {
  SERVER_DATABASE,
  SERVER_HOSTNAME,
  SERVER_PASSWORD,
  SERVER_USER,
} from "../global/environment";
import mysql = require("mysql");
import util  from 'util'

export default class MySql {
  private static _instance: MySql;

  cnn: mysql.Connection;
  connected: boolean = false;

  constructor() {
    // para la conección se llaman las variables de entorno
    this.cnn = mysql.createConnection({
      host: SERVER_HOSTNAME,
      user: SERVER_USER,
      password: SERVER_PASSWORD,
      database: SERVER_DATABASE,
    });

    this.connectDB();
  }

  // esto es para prevenir llamar varias veces la misma instancia
  public static get instances() {
    return this._instance || (this._instance = new this());
  }

  // funcion par ahacer consultas
  static async executeQuery(query: string) {
    return util.promisify(this.instances.cnn.query)
    .call(this.instances.cnn, query);
  }

  // conectar base de datos
  private connectDB() {
    this.cnn.connect((err: mysql.MysqlError) => {
      if (err) {
        console.log(err.sqlMessage);
        return;
      }

      this.connected = true;
      console.log("Base de Datos online");
    });
  }
}
