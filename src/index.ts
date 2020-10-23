import bodyParser from "body-parser";
import cors from "cors";
import { Request, Response } from "express";
import { ValidationError } from "express-validation";
import * as pkg from "../package.json";
import { createRoles } from "./lib/initialSetup";
import MySql from "./mysql/mysql";
import router from "./routes/router";
import Server from "./server/server";

const server = Server.instance;

// Mysql
MySql.instances;
createRoles();

// BodyPArser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({ origin: true, credentials: true }));

// Rutas
server.app.use("/api/", router);
server.app.set("pkg", pkg);
server.app.get("/", (req: Request, res: Response) =>
  res.json({
    message: "Welcome to my API",
    name: server.app.get("pkg").name,
    author: server.app.get("pkg").author,
    description: server.app.get("pkg").description,
    version: server.app.get("pkg").version,
  })
);

// Validators
server.app.use(
  (err: any, req: Request, res: Response, next: CallableFunction) => {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }

    return res.status(500).json(err);
  }
);

server.start(() => {
  console.log(`Servidor corriendo  en el puerto ${server.port}`);
});
