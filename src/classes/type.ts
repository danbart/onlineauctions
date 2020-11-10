import { Request, Response } from "express";
import { ModelType } from "../models/type";
import MySql from "../mysql/mysql";
import { IResponse } from "./interface/IResponse";

export class Type {
  getSType = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {
      await MySql.executeQuery(`SELECT * FROM type`)
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

  getSTypeId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const typeId = req.params.id;

    let types: ModelType[] = [];

    await MySql.executeQuery(
      `SELECT * FROM type where id_type=${typeId} limit 1;`
    ).then((data: any) => (types = data));

    if (types.length === 0) {
      result.error = { message: "Typo no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM type where id_type=${typeId} limit 1`
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

  postType = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const type = new ModelType();

    let types: ModelType[] = [];

    await MySql.executeQuery(
      `SELECT * FROM type where type='${req.body.type}' limit 1;`
    ).then((data: any) => (types = data));

    if (types.length > 0) {
      result.error = { message: "El Tipo ya existe" };
      return res.status(401).json(result);
    }

    !!req.body.type && (type.type = req.body.type);

    try {
      await MySql.executeQuery(`INSERT INTO type(type) VALUES('${type.type}')`)
        .then((data: any) => {
          result.ok = true;
          result.data = [{ typeId: data.insertId }];
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

  putType = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const typeId = req.params.id;

    const type = new ModelType();

    let types: ModelType[] = [];

    await MySql.executeQuery(
      `SELECT * FROM type where id_type=${typeId} limit 1;`
    ).then((data: any) => (types = data));

    if (types.length === 0) {
      result.error = { message: "El Tipo no existe" };
      return res.status(401).json(result);
    }

    !!req.body.type && (type.type = req.body.type);

    try {
      await MySql.executeQuery(
        `Update type set type='${type.type}' where id_stype=${typeId};`
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
