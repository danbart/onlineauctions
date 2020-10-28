import { Router } from "express";
import { validate } from "express-validation";
import { Note } from "../classes/note";
import { verificaToken } from "../middlewares/autentication";
import { noteValidator } from "../middlewares/uniqueValidators";

export const routerNote = Router();
const note = new Note();

routerNote.get("/:id/note/", note.getNote);
routerNote.get("/:idVehicle/note/:idNote", verificaToken, note.getNoteId);
routerNote.post(
  "/:id/note/",
  verificaToken,
  validate(noteValidator),
  note.postNote
);
routerNote.put(
  "/note/:id",
  verificaToken,
  validate(noteValidator),
  note.putNote
);
