import { Router } from "express";
import { State } from "../classes/state";
import { verificaToken } from "../middlewares/autentication";

export const routeState = Router();
const state = new State();

routeState.get("/", verificaToken, state.getState);
routeState.get("/:id", verificaToken, state.getStateId);
