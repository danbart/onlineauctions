import { Request, Response } from "express";
import { ModelState } from "../models/state";
import MySql from "../mysql/mysql";
import { IResponse } from "./interface/IResponse";

export class State {
  getState = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {
      await MySql.executeQuery(`SELECT * FROM state`)
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

  getStateId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const stateId = req.params.id;

    let states: ModelState[] = [];

    await MySql.executeQuery(
      `SELECT * FROM state where id_state="${stateId}" limit 1;`
    ).then((data: any) => (states = data));

    if (states.length === 0) {
      result.error = { message: "Estado no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM state where id_state="${stateId}" limit 1`
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

  postState = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const state = new ModelState();

    let states: ModelState[] = [];

    await MySql.executeQuery(
      `SELECT * FROM state where state="${req.body.state}" limit 1;`
    ).then((data: any) => (states = data));

    if (states.length > 0) {
      result.error = { message: "El estado ya existe" };
      return res.json(result);
    }

    !!req.body.state && (state.state = req.body.state);

    try {
      await MySql.executeQuery(
        `INSERT INTO state(state) VALUES("${state.state}")`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ userId: data.insertId }];
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

  putState = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const stateId = req.params.id;

    const state = new ModelState();

    let states: ModelState[] = [];

    await MySql.executeQuery(
      `SELECT * FROM state where id_state="${stateId}" limit 1;`
    ).then((data: any) => (states = data));

    if (states.length === 0) {
      result.error = { message: "Estado no existe" };
      return res.json(result);
    }

    !!req.body.state && (state.state = req.body.state);

    try {
      await MySql.executeQuery(
        `Update state set state="${state.state}" where id_state=${stateId};`
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
