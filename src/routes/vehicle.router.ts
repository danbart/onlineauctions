import { Router } from "express";
import { validate } from "express-validation";
import { Vehicle } from "../classes/vehicle";
import { verificaToken } from "../middlewares/autentication";
import {
  vehicleValidator,
  vehicleValidatorUpdate,
} from "../middlewares/validatorsVehicle";

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
routerVehicle.put(
  "/:id",
  verificaToken,
  validate(vehicleValidatorUpdate),
  vehicle.putVehicle
);

routerVehicle.post("/:id/photo", verificaToken, vehicle.postPhoto);
