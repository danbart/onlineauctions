import { Request, Response } from "express";
import moment from "moment";
import { FORMAT_DATE } from "../global/environment";
import { ModelBodyStyle } from "../models/bodyStyle";
import { ModelPhoto } from "../models/photo";
import { ModelState } from "../models/state";
import { ModelType } from "../models/type";
import { ModelVehicle } from "../models/vehicle";
import MySql from "../mysql/mysql";
import { userLogin } from "../utils/jwt";
import { uploadFile } from "../utils/upload";
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
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (veicles = data));

    if (veicles.length === 0) {
      result.error = { message: "Vehiculo no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT v.*, s.state, bs.style, t.type 
            FROM vehicle v INNER JOIN state s on v.id_state=s.id_state INNER JOIN body_style bs on v.id_body_style=bs.id_body_style
            INNER JOIN type t on v.id_type=t.id_type where v.id_vehicle=${vehicleId} limit 1;`
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
      `SELECT * FROM vehicle where vin='${req.body.vin}' limit 1;`
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
      `SELECT * FROM state where id_state=${vehicle.id_state} limit 1;`
    ).then((data: any) => (states = data));

    if (states.length === 0) {
      result.error = { message: "Estado no existe" };
      return res.status(401).json(result);
    }

    let types: ModelType[] = [];

    await MySql.executeQuery(
      `SELECT * FROM type where id_type=${vehicle.id_type} limit 1;`
    ).then((data: any) => (types = data));

    if (types.length === 0) {
      result.error = { message: "Typo no existe" };
      return res.status(401).json(result);
    }

    let bodyStyles: ModelBodyStyle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM body_style where id_body_style=${vehicle.id_body_style} limit 1;`
    ).then((data: any) => (bodyStyles = data));

    if (bodyStyles.length === 0) {
      result.error = { message: "Carroceria no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `INSERT INTO vehicle(model, mileage,colour,transmission,cylinders,fuel,revolutions,motor,vin,\`keys\`,description,id_type,id_state,id_body_style,id_user) 
            VALUES('${vehicle.model}','${vehicle.mileage}','${
          vehicle.colour
        }','${vehicle.transmission}', '${vehicle.cylinders}','${
          vehicle.fuel
        }', ${vehicle.revolutions},
                   ${vehicle.motor},'${vehicle.vin.toUpperCase()}', ${
          vehicle.keys
        }, '${vehicle.description}',${vehicle.id_type}, ${vehicle.id_state}, ${
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
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} and  id_user=${userId} and sold is null limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = {
        message: "El Vehiculo no existe o No puedes editar este vehiculo",
      };
      return res.status(401).json(result);
    }

    !!req.body.model
      ? (vehicle.model = req.body.model + "-01-01")
      : (vehicle.model = moment(vehicles[0].model)
          .format(FORMAT_DATE)
          .toString());
    !!req.body.mileage
      ? (vehicle.mileage = req.body.mileage)
      : (vehicle.mileage = vehicles[0].mileage);
    !!req.body.colour
      ? (vehicle.colour = req.body.colour)
      : (vehicle.colour = vehicles[0].colour);
    !!req.body.transmission
      ? (vehicle.transmission = req.body.transmission)
      : (vehicle.transmission = vehicles[0].transmission);
    !!req.body.cylinders
      ? (vehicle.cylinders = req.body.cylinders)
      : (vehicle.cylinders = vehicles[0].cylinders);
    !!req.body.fuel
      ? (vehicle.fuel = req.body.fuel)
      : (vehicle.fuel = vehicles[0].fuel);
    !!req.body.revolutions
      ? (vehicle.revolutions = req.body.revolutions)
      : (vehicle.revolutions = vehicles[0].revolutions);
    !!req.body.motor
      ? (vehicle.motor = req.body.motor)
      : (vehicle.motor = vehicles[0].motor);
    !!req.body.keys
      ? (vehicle.keys = req.body.keys)
      : (vehicle.keys = vehicles[0].keys);
    !!req.body.description
      ? (vehicle.description = req.body.description)
      : (vehicle.description = vehicles[0].description);
    !!req.body.type
      ? (vehicle.id_type = parseInt(req.body.type))
      : (vehicle.id_type = vehicles[0].id_type);
    !!req.body.state
      ? (vehicle.id_state = parseInt(req.body.state))
      : (vehicle.id_state = vehicles[0].id_state);
    !!req.body.body_style
      ? (vehicle.id_body_style = parseInt(req.body.body_style))
      : (vehicle.id_body_style = vehicles[0].id_body_style);

    if (!!req.body.state) {
      let states: ModelState[] = [];

      await MySql.executeQuery(
        `SELECT * FROM state where id_state=${vehicle.id_state} limit 1;`
      ).then((data: any) => (states = data));

      if (states.length === 0) {
        result.error = { message: "Estado no existe" };
        return res.status(401).json(result);
      }
    }

    if (!!req.body.type) {
      let types: ModelType[] = [];

      await MySql.executeQuery(
        `SELECT * FROM type where id_type=${vehicle.id_type} limit 1;`
      ).then((data: any) => (types = data));

      if (types.length === 0) {
        result.error = { message: "Typo no existe" };
        return res.status(401).json(result);
      }
    }

    if (!!req.body.body_style) {
      let bodyStyles: ModelBodyStyle[] = [];

      await MySql.executeQuery(
        `SELECT * FROM body_style where id_body_style=${vehicle.id_body_style} limit 1;`
      ).then((data: any) => (bodyStyles = data));

      if (bodyStyles.length === 0) {
        result.error = { message: "Carroceria no existe" };
        return res.status(401).json(result);
      }
    }

    try {
      await MySql.executeQuery(
        `UPDATE vehicle SET model='${vehicle.model}', mileage='${vehicle.mileage}',colour='${vehicle.colour}',transmission='${vehicle.transmission}',
        cylinders='${vehicle.cylinders}',fuel='${vehicle.fuel}',revolutions=${vehicle.revolutions},motor=${vehicle.motor},\`keys\`=${vehicle.keys},
        description='${vehicle.description}',id_type=${vehicle.id_type},id_state=${vehicle.id_state},id_body_style=${vehicle.id_body_style} WHERE id_vehicle=${vehicleId};`
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

  postPhoto = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };
    const idVehicle = req.params.id;

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    let vehicles: ModelVehicle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${idVehicle} and id_user=${userId} and sold is null limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = {
        message: "El Vehiculo no existe o No puedes editar este vehiculo",
      };
      return res.status(401).json(result);
    }

    if (!req.files) {
      result.error = { menssage: "archivo requerido" };
      return res.json(result);
    }

    const resp = await uploadFile(parseInt(idVehicle), "vehicle", req);

    res.json(resp);
  };

  getPhoto = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };
    const idVehicle = req.params.id;

    let photos: ModelPhoto[] = [];

    await MySql.executeQuery(
      `SELECT * FROM photo where id_vehicle=${idVehicle};`
    ).then((data: any) => (photos = data));

    if (photos.length === 0) {
      result.error = {
        message: "El Vehiculo no cuenta con fotos",
      };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM photo where id_vehicle=${idVehicle};`
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

  getPhotoId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };
    const idVehicle = req.params.idVehicle;
    const idPhoto = req.params.idPhoto;

    let photos: ModelPhoto[] = [];

    await MySql.executeQuery(
      `SELECT * FROM photo where id_vehicle=${idVehicle} and id_photo=${idPhoto};`
    ).then((data: any) => (photos = data));

    if (photos.length === 0) {
      result.error = {
        message: "El Vehiculo no cuenta con esa foto",
      };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM photo where id_vehicle=${idVehicle} and id_photo=${idPhoto};`
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
}
