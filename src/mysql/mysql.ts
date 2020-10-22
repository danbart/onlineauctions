import { SERVER_HOSTNAME, SERVER_USER, SERVER_PASSWORD, SERVER_DATABASE } from '../global/environment';
import mysql = require('mysql');



export default class MySql {


    private static _instance: MySql;

    cnn: mysql.Connection;
    conectado: boolean = false;

    constructor() {
        
        // para la conección se llaman las variables de entorno
        this.cnn = mysql.createConnection({
            host: SERVER_HOSTNAME,
            user: SERVER_USER,
            password: SERVER_PASSWORD,
            database: SERVER_DATABASE
        });

        this.conectarDB();
        
    }

    // esto es para prevenir llamar varias veces la misma instancia
    public static get instances() {
        return this._instance || (this._instance = new this());
    }
    
    // funcion par ahacer consultas
    static ejecutarQuery( query: string, callback: Function ) {
        return this.instances.cnn.query(query, (err, results: Object[], fields ) => {

            if ( err ) {
                console.log("Error en query");
                console.log(err.sqlMessage);
                return callback( err.sqlMessage );
            }

            if ( results.length === 0 ) {
                callback('El registro solicitado no existe')
            } else {
                callback( null, results );
            }

        })
    }
    
    // conectar base de datos
    private conectarDB() {
        this.cnn.connect((err: mysql.MysqlError) => {

            if ( err ) {
                console.log(err.sqlMessage);
                return;
            }

            this.conectado = true;
            console.log('Base de Datos online');

        });
    }


}