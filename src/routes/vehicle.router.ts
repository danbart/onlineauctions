import { Router } from "express";
import { validate } from "express-validation";
import { Vehicle } from "../classes/vehicle";
import { verificaToken } from "../middlewares/autentication";
import { vehicleValidator } from '../middlewares/validatorsVehicle';

export const routerVehicle = Router();
const vehicle = new Vehicle();

routerVehicle.get("/", vehicle.getVehicle);
routerVehicle.get("/:id", vehicle.getVehicleId);
routerVehicle.post(
  "/",
  verificaToken,
  validate(vehicleValidator),
  vehicle.postVehicle
);
// routerNote.put(
//   "/:idVehicle/note/:id",
//   verificaToken,
//   validate(noteValidator),
//   note.putNote
// );
