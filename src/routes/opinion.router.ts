import { Router } from "express";
import { validate } from "express-validation";
import { Opinion } from "../classes/opinion";
import { verificaToken } from "../middlewares/autentication";
import {
  opinionValidator,
  opinionValidatorUpdate,
} from "../middlewares/validatosOpinion";

export const routerOpinion = Router();
const opinion = new Opinion();

routerOpinion.get("/:id/opinion", opinion.getOpinion);

routerOpinion.get("/:idVehicle/opinion/:idOpinion", opinion.getOpinionId);

routerOpinion.post(
  "/:idVehicle/opinion/",
  verificaToken,
  validate(opinionValidator),
  opinion.postOpinion
);

routerOpinion.put(
  "/:idVehicle/opinion/:idOpinion",
  verificaToken,
  validate(opinionValidatorUpdate),
  opinion.putOponion
);
