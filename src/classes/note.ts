import { Request, Response } from "express";
import MySql from "../mysql/mysql";
import { IResponse } from "./interface/IResponse";
import { ModelNote } from "../models/note";

export class Note {
  getNote = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.id;

    let notes: ModelNote[] = [];

    await MySql.executeQuery(
      `SELECT * FROM note where id_vehicle="${vehicleId}" limit 1;`
    ).then((data: any) => (notes = data));

    if (notes.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM note where id_vehicle=${vehicleId}`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = data;
        })
        .catch((err) => {
          result.ok = false;
          result.error = err.sqlMessage;
        });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };

  getNoteId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.idVehicle;
    const noteId = req.params.idNote;

    let vehicles: ModelNote[] = [];
    let notes: ModelNote[] = [];

    await MySql.executeQuery(
      `SELECT * FROM note where id_vehicle="${vehicleId}" limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM note where id_note="${noteId}" limit 1;`
    ).then((data: any) => (notes = data));

    if (notes.length === 0) {
      result.error = { message: "Nota no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM note where id_note="${noteId}" limit 1`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = data;
        })
        .catch((err) => {
          result.ok = false;
          result.error = err.sqlMessage;
        });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };

  postNote = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.id;

    let notes: ModelNote[] = [];

    await MySql.executeQuery(
      `SELECT * FROM note where id_vehicle="${vehicleId}" limit 1;`
    ).then((data: any) => (notes = data));

    if (notes.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    const note = new ModelNote();

    !!req.body.note && (note.note = req.body.note);
    note.id_vehicle = parseInt(req.params.id);

    try {
      await MySql.executeQuery(
        `INSERT INTO note(note, id_vehicle) VALUES("${note.note}", ${note.id_vehicle})`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ noteId: data.insertId }];
        })
        .catch((err) => {
          result.ok = false;
          result.error = err.sqlMessage;
        });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };

  putNote = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const noteId = req.params.id;

    const note = new ModelNote();

    let notes: ModelNote[] = [];

    await MySql.executeQuery(
      `SELECT * FROM note where id_note="${noteId}" limit 1;`
    ).then((data: any) => (notes = data));

    if (notes.length === 0) {
      result.error = { message: "Estado no existe" };
      return res.json(result);
    }

    !!req.body.note && (note.note = req.body.note);

    try {
      await MySql.executeQuery(
        `Update note set note="${note.note}" where id_note=${noteId};`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ message: data.message }];
        })
        .catch((err) => {
          result.ok = false;
          result.error = err.sqlMessage;
        });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };
}
