import { Router } from "express";
import { validate } from "express-validation";
import { User } from "../classes/user";
import {
  userValidator,
  userValidatorUpdate,
} from "../middlewares/validatorsUser";

export const routeUser = Router();
const user = new User();

routeUser.get("/", user.getUsers);
routeUser.get("/:id", user.getUserId);
routeUser.post("/", validate(userValidator), user.postUser);
routeUser.put("/:id", validate(userValidatorUpdate), user.putUser);
