import { Request, Response } from "express";
import { ModelBodyStyle } from "../models/bodyStyle";
import MySql from "../mysql/mysql";
import { IResponse } from "./interface/IResponse";

export class BodyStyle {
  getBodyStyle = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {
      await MySql.executeQuery(`SELECT * FROM body_style`)
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

  getBodyStyleId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const bodyStyleId = req.params.id;

    let bodyStyles: ModelBodyStyle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM body_style where id_body_style="${bodyStyleId}" limit 1;`
    ).then((data: any) => (bodyStyles = data));

    if (bodyStyles.length === 0) {
      result.error = { message: "Estado no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM body_style where id_body_style="${bodyStyleId}" limit 1`
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

  postBodyStyle = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const bodyStyle = new ModelBodyStyle();

    let bodyStyles: ModelBodyStyle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM body_style where style="${req.body.style}" limit 1;`
    ).then((data: any) => (bodyStyles = data));

    if (bodyStyles.length > 0) {
      result.error = { message: "La Carroceria ya existe" };
      return res.json(result);
    }

    !!req.body.style && (bodyStyle.style = req.body.style);

    try {
      await MySql.executeQuery(
        `INSERT INTO body_style(style) VALUES("${bodyStyle.style}")`
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

  putBodyStyle = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const bodyStyleId = req.params.id;

    const bodyStyle = new ModelBodyStyle();

    let bodyStyles: ModelBodyStyle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM body_style where id_body_style="${bodyStyleId}" limit 1;`
    ).then((data: any) => (bodyStyles = data));

    if (bodyStyles.length === 0) {
      result.error = { message: "Carrocería no existe" };
      return res.json(result);
    }

    !!req.body.style && (bodyStyle.style = req.body.style);

    try {
      await MySql.executeQuery(
        `Update body_style set style="${bodyStyle.style}" where id_body_style=${bodyStyleId};`
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
