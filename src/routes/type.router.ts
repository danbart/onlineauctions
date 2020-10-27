import { Router } from "express";
import { validate } from "express-validation";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import { typeValidator } from "../middlewares/uniqueValidators";
import { Type } from "../classes/type";

export const routerType = Router();
const type = new Type();

routerType.get("/", verificaToken, type.getSType);
routerType.get("/:id", verificaToken, type.getSTypeId);
routerType.post(
  "/",
  verificaToken,
  isRegister,
  validate(typeValidator),
  type.postType
);
routerType.put(
  "/:id",
  verificaToken,
  isAdmin,
  validate(typeValidator),
  type.putType
);
