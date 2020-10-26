import { Router } from "express";
import { validate } from "express-validation";
import { User } from "../classes/user";
import {
  userValidator,
  userValidatorLogin,
} from "../middlewares/validatorsUser";

export const routerLogin = Router();
const user = new User();

routerLogin.post("/register", validate(userValidator), user.postUser);

routerLogin.post("/login", validate(userValidatorLogin), user.loginUser);
