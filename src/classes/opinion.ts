import { Request, Response } from "express";
import { ModelOpinion } from "../models/opinion";
import { ModelVehicle } from "../models/vehicle";
import MySql from "../mysql/mysql";
import { userLogin } from "../utils/jwt";
import { IResponse } from "./interface/IResponse";

export class Opinion {
  getOpinion = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.id;

    let veicles: ModelVehicle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (veicles = data));

    if (veicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM opinion where id_vehicle=${vehicleId};`
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

  getOpinionId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const opinionId = req.params.idOpinion;

    let opinions: ModelOpinion[] = [];

    const vehicleId = req.params.idVehicle;

    let veicles: ModelVehicle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (veicles = data));

    if (veicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM opinion where id_opinion=${opinionId} limit 1;`
    ).then((data: any) => (opinions = data));

    if (opinions.length === 0) {
      result.error = { message: "Opinion no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT op.*, u.name as opinado_name, u.last_name as opinado_last_name, us.name as opino_name, us.last_name as opino_last_name 
        FROM opinion op inner join user u on op.id_user_opined=u.id_user
        inner join user us on op.id_user_say=us.id_user 
        where id_opinion=${opinionId} limit 1;`
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

  postOpinion = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const opinion = new ModelOpinion();

    const vehicleId = req.params.idVehicle;

    let veicles: ModelVehicle[] = [];

    let opinions: ModelOpinion[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (veicles = data));

    if (veicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM opinion where id_vehicle=${vehicleId} and id_user_say=${userId} limit 1;`
    ).then((data: any) => (opinions = data));

    if (opinions.length > 0) {
      result.error = {
        message: "No puede hacer mas de 1 opinion por vehiculo",
      };
      return res.status(401).json(result);
    }

    if (veicles[0].id_user === userId) {
      result.error = { message: "No puede opinar su propio vehiculo" };
      return res.status(401).json(result);
    }

    !!req.body.opinion && (opinion.opinion = req.body.opinion);
    !!req.body.rating && (opinion.rating = req.body.rating);

    try {
      await MySql.executeQuery(
        `INSERT INTO opinion(opinion, rating, id_vehicle, id_user_opined, id_user_say) 
        VALUES('${opinion.opinion}', ${opinion.rating}, ${vehicleId}, ${veicles[0].id_user}, ${userId});`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ opinionId: data.insertId }];
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

  putOponion = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const opinion = new ModelOpinion();

    const vehicleId = req.params.idVehicle;

    const opinionId = req.params.idOpinion;

    let veicles: ModelVehicle[] = [];

    let opinions: ModelOpinion[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (veicles = data));

    if (veicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM opinion where id_vehicle=${vehicleId} and id_user_say=${userId} and id_opinion=${opinionId} limit 1;`
    ).then((data: any) => (opinions = data));

    if (opinions.length === 0) {
      result.error = { message: "Opinion no Existe" };
      return res.status(401).json(result);
    }

    !!req.body.opinion
      ? (opinion.opinion = req.body.opinion)
      : (opinion.opinion = opinions[0].opinion);
    !!req.body.rating
      ? (opinion.rating = req.body.rating)
      : (opinion.rating = opinions[0].rating);

    try {
      await MySql.executeQuery(
        `Update opinion set opinion='${opinion.opinion}', rating=${opinion.rating} where id_opinion=${opinionId};`
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
