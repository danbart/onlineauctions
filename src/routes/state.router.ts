import { Router } from "express";
import { validate } from "express-validation";
import { State } from "../classes/state";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import { stateValidator } from "../middlewares/uniqueValidators";

export const routeState = Router();
const state = new State();

routeState.get("/", verificaToken, state.getState);
routeState.get("/:id", verificaToken, state.getStateId);
routeState.post(
  "/",
  verificaToken,
  isRegister,
  validate(stateValidator),
  state.postState
);
routeState.put(
  "/:id",
  verificaToken,
  isAdmin,
  validate(stateValidator),
  state.putState
);
