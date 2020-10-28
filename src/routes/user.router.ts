import { Router } from "express";
import { validate } from "express-validation";
import { User } from "../classes/user";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import {
  userValidator,
  userValidatorUpdate,
} from "../middlewares/validatorsUser";

export const routerUser = Router();
const user = new User();

routerUser.get("/", [verificaToken, isRegister], user.getUsers);
routerUser.get("/profile", verificaToken, user.getUserId);
routerUser.get("/:id", [verificaToken, isRegister], user.getUserId);
routerUser.post(
  "/",
  [verificaToken, isRegister, validate(userValidator)],
  user.postUser
);
routerUser.put(
  "/profile",
  [verificaToken, validate(userValidatorUpdate)],
  user.putUser
);
routerUser.put(
  "/:id",
  [verificaToken, isAdmin, validate(userValidatorUpdate)],
  user.putUser
);