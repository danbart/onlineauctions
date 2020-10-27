import { Router } from "express";
import { validate } from "express-validation";
import { BodyStyle } from "../classes/body_style";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import { bodyStyleValidator } from "../middlewares/uniqueValidators";

export const routerbodyStyle = Router();
const bodyStyle = new BodyStyle();

routerbodyStyle.get("/", verificaToken, bodyStyle.getBodyStyle);
routerbodyStyle.get("/:id", verificaToken, bodyStyle.getBodyStyleId);
routerbodyStyle.post(
  "/",
  verificaToken,
  isRegister,
  validate(bodyStyleValidator),
  bodyStyle.postBodyStyle
);
routerbodyStyle.put(
  "/:id",
  verificaToken,
  isAdmin,
  validate(bodyStyleValidator),
  bodyStyle.putBodyStyle
);
