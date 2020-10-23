import { Router } from "express";
import { User } from "../classes/user";

export const routeUser = Router();
const user = new User();

routeUser.get("/", user.getUsers);
