import { Router } from "express";
import { validate } from "express-validation";
import { State } from "../classes/state";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import { stateValidator } from "../middlewares/uniqueValidators";

export const routerState = Router();
const state = new State();

routerState.get("/", verificaToken, state.getState);
routerState.get("/:id", verificaToken, state.getStateId);
routerState.post(
  "/",
  verificaToken,
  isRegister,
  validate(stateValidator),
  state.postState
);
routerState.put(
  "/:id",
  verificaToken,
  isAdmin,
  validate(stateValidator),
  state.putState
);
