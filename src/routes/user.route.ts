import { Router } from "express";
import { validate } from "express-validation";
import { User } from "../classes/user";
import {
  isAdmin,
  verificaToken,
  isRegister,
} from "../middlewares/autentication";
import {
  userValidator,
  userValidatorUpdate,
} from "../middlewares/validatorsUser";

export const routeUser = Router();
const user = new User();

routeUser.get("/", [verificaToken, isRegister], user.getUsers);
routeUser.get("/profile", verificaToken, user.getUserId);
routeUser.get("/:id", [verificaToken, isRegister], user.getUserId);
routeUser.post(
  "/",
  [verificaToken, isRegister, validate(userValidator)],
  user.postUser
);
routeUser.put(
  "/:id",
  [verificaToken, isAdmin, validate(userValidatorUpdate)],
  user.putUser
);
