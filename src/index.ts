import Server from './server/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import MySql from './mysql/mysql';
import { ValidationError } from 'express-validation';
import { Request, Response } from 'express';

const server = Server.instance;

// Mysql
MySql.instances;

// BodyPArser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// CORS
server.app.use( cors({ origin: true, credentials: true }));

// Rutas
server.app.use('/', router);

// Validators
server.app.use((err:any, req:Request, res:Response, next:CallableFunction) => {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
  
    return res.status(500).json(err)
  })

server.start( () => {
    console.log(`Servidor corriendo  en el puerto ${server.port}`);
});