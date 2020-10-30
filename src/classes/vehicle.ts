import { Request, Response } from "express";
import { ModelBodyStyle } from "../models/bodyStyle";
import { ModelState } from "../models/state";
import { ModelType } from "../models/type";
import { ModelVehicle } from "../models/vehicle";
import MySql from "../mysql/mysql";
import { userLogin } from "../utils/jwt";
import { IResponse } from "./interface/IResponse";

export class Vehicle {
  getVehicle = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {
      await MySql.executeQuery(`SELECT * FROM vehicle`)
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

  getVehicleId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.id;

    let veicles: ModelVehicle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle="${vehicleId}" limit 1;`
    ).then((data: any) => (veicles = data));

    if (veicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT v.*, s.state, bs.style, t.type 
            FROM vehicle v INNER JOIN state s on v.id_state=s.id_state INNER JOIN body_style bs on v.id_body_style=bs.id_body_style
            INNER JOIN type t on v.id_type=t.id_type where v.id_vehicle="${vehicleId}" limit 1`
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

  postVehicle = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicle = new ModelVehicle();

    let vehicles: ModelVehicle[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM vehicle where vin="${req.body.vin}" limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length > 0) {
      result.error = { message: "El VIN ya existe" };
      return res.json(result);
    }

    !!req.body.model && (vehicle.model = req.body.model + "-01-01");
    !!req.body.mileage
      ? (vehicle.mileage = req.body.mileage)
      : (vehicle.mileage = "");
    !!req.body.colour && (vehicle.colour = req.body.colour);
    !!req.body.transmission && (vehicle.transmission = req.body.transmission);
    !!req.body.cylinders
      ? (vehicle.cylinders = req.body.cylinders)
      : (vehicle.cylinders = "");
    !!req.body.fuel ? (vehicle.fuel = req.body.fuel) : (vehicle.fuel = "");
    !!req.body.revolutions
      ? (vehicle.revolutions = req.body.revolutions)
      : (vehicle.revolutions = 0);
    !!req.body.motor ? (vehicle.motor = req.body.motor) : (vehicle.motor = 0);
    !!req.body.vin && (vehicle.vin = req.body.vin);
    !!req.body.keys ? (vehicle.keys = req.body.keys) : (vehicle.keys = false);
    !!req.body.description
      ? (vehicle.description = req.body.description)
      : (vehicle.description = "");
    !!req.body.type && (vehicle.id_type = parseInt(req.body.type));
    !!req.body.state && (vehicle.id_state = parseInt(req.body.state));
    !!req.body.body_style &&
      (vehicle.id_body_style = parseInt(req.body.body_style));
    userId != 0 && (vehicle.id_user = userId);

    let states: ModelState[] = [];

    await MySql.executeQuery(
      `SELECT * FROM state where id_state="${vehicle.id_state}" limit 1;`
    ).then((data: any) => (states = data));

    if (states.length === 0) {
      result.error = { message: "Estado no existe" };
      return res.status(401).json(result);
    }

    let types: ModelType[] = [];

    await MySql.executeQuery(
      `SELECT * FROM type where id_type="${vehicle.id_type}" limit 1;`
    ).then((data: any) => (types = data));

    if (types.length === 0) {
      result.error = { message: "Typo no existe" };
      return res.status(401).json(result);
    }

    let bodyStyles: ModelBodyStyle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM body_style where id_body_style="${vehicle.id_body_style}" limit 1;`
    ).then((data: any) => (bodyStyles = data));

    if (bodyStyles.length === 0) {
      result.error = { message: "Carroceria no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `INSERT INTO vehicle(model, mileage,colour,transmission,cylinders,fuel,revolutions,motor,vin,\`keys\`,description,id_type,id_state,id_body_style,id_user) 
            VALUES("${vehicle.model}","${vehicle.mileage}","${
          vehicle.colour
        }","${vehicle.transmission}", "${vehicle.cylinders}","${
          vehicle.fuel
        }", ${vehicle.revolutions},
                   ${vehicle.motor},"${vehicle.vin.toUpperCase()}", ${
          vehicle.keys
        }, "${vehicle.description}",${vehicle.id_type}, ${vehicle.id_state}, ${
          vehicle.id_body_style
        },${vehicle.id_user});`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ vehicleId: data.insertId }];
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

  putVehicle = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.id;

    const vehicle = new ModelVehicle();

    let vehicles: ModelVehicle[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} and  id_user="${userId}" limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = {
        message: "El Vehiculo no existe o No puedes editar este vehiculo",
      };
      return res.status(401).json(result);
    }

    !!req.body.model && (vehicle.model = req.body.model + "-01-01");
    !!req.body.mileage && (vehicle.mileage = req.body.mileage);
    !!req.body.colour && (vehicle.colour = req.body.colour);
    !!req.body.transmission && (vehicle.transmission = req.body.transmission);
    !!req.body.cylinders && (vehicle.cylinders = req.body.cylinders);
    !!req.body.fuel && (vehicle.fuel = req.body.fuel);
    !!req.body.revolutions && (vehicle.revolutions = req.body.revolutions);
    !!req.body.motor && (vehicle.motor = req.body.motor);
    !!req.body.keys && (vehicle.keys = req.body.keys);
    !!req.body.description && (vehicle.description = req.body.description);
    !!req.body.type && (vehicle.id_type = parseInt(req.body.type));
    !!req.body.state && (vehicle.id_state = parseInt(req.body.state));
    !!req.body.body_style &&
      (vehicle.id_body_style = parseInt(req.body.body_style));

    if (!!req.body.state) {
      let states: ModelState[] = [];

      await MySql.executeQuery(
        `SELECT * FROM state where id_state="${vehicle.id_state}" limit 1;`
      ).then((data: any) => (states = data));

      if (states.length === 0) {
        result.error = { message: "Estado no existe" };
        return res.status(401).json(result);
      }
    }

    if (!!req.body.type) {
      let types: ModelType[] = [];

      await MySql.executeQuery(
        `SELECT * FROM type where id_type="${vehicle.id_type}" limit 1;`
      ).then((data: any) => (types = data));

      if (types.length === 0) {
        result.error = { message: "Typo no existe" };
        return res.status(401).json(result);
      }
    }

    if (!!req.body.body_style) {
      let bodyStyles: ModelBodyStyle[] = [];

      await MySql.executeQuery(
        `SELECT * FROM body_style where id_body_style="${vehicle.id_body_style}" limit 1;`
      ).then((data: any) => (bodyStyles = data));

      if (bodyStyles.length === 0) {
        result.error = { message: "Carroceria no existe" };
        return res.status(401).json(result);
      }
    }

    try {
      await MySql.executeQuery(
        `UPDATE vehicle SET model="${vehicle.model}", mileage="${vehicle.mileage}",colour="${vehicle.colour}",transmission="${vehicle.transmission}",
        cylinders="${vehicle.cylinders}",fuel="${vehicle.fuel}",revolutions=${vehicle.revolutions},motor=${vehicle.motor},\`keys\`=${vehicle.keys},
        description="${vehicle.description}",id_type=${vehicle.id_type},id_state=${vehicle.id_state},id_body_style=${vehicle.id_body_style} WHERE=${vehicleId};`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ message: data.message }];
        })
        .catch((err) => {
          result.ok = false;
          result.error = err.sqlMessage;
          console.log(err);
        });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };
}
