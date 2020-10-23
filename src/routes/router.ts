import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { validate } from "express-validation";
import validator from "validator";
import { registerValidator } from "../middlewares/validators";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";
import Server from "../server/server";
import { usuariosConectados } from "../sockets/socket";
import { routeUser } from "./user.route";

const router = Router();

router.use("/user/", routeUser);

export default router;
