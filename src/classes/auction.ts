import { Request, Response } from "express";
import moment from "moment";
import { FORMAT_DATE_TIME } from "../global/environment";
import { ModelAuction } from "../models/auction";
import { ModelPhoto } from "../models/photo";
import { ModelVehicle } from "../models/vehicle";
import MySql from "../mysql/mysql";
import { userLogin } from "../utils/jwt";
import { IResponse } from "./interface/IResponse";

export class Auction {
  getAuction = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {
      await MySql.executeQuery(`SELECT * FROM auction`)
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

  getAuctionId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const auctionId = req.params.id;

    let auctions: ModelAuction[] = [];

    await MySql.executeQuery(
      `SELECT * FROM auction where id_auction="${auctionId}" limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM auction where id_auction="${auctionId}" limit 1;`
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

  postAuction = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const vehicleId = req.params.id;

    const auction = new ModelAuction();

    let vehicles: ModelVehicle[] = [];

    let auctions: ModelAuction[] = [];

    let photos: ModelPhoto[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} and id_user=${userId} limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = {
        message: "El Vehiculo no existe",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM photo where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (photos = data));

    if (photos.length >= 3) {
      result.error = { message: "El vehiculo necesita minimo 3 fotos" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM auction where id_vehicle=${vehicleId} limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length > 0) {
      result.error = { message: "El vehiculo ya tiene subasta" };
      return res.status(401).json(result);
    }

    !!req.body.auction_date &&
      (auction.auction_date = moment(req.body.auction_date)
        .format(FORMAT_DATE_TIME)
        .toString());
    if (!moment(auction.auction_date, FORMAT_DATE_TIME).isValid()) {
      result.error = { message: "La fecha y hora no son validas" };
      return res.status(401).json(result);
    }
    if (moment(auction.auction_date).diff(moment()) <= 0) {
      result.error = { message: "La fecha no son validas" };
      return res.status(401).json(result);
    }
    !!req.body.initial_amount &&
      (auction.initial_amount = req.body.initial_amount);
    !!req.body.description && (auction.description = req.body.description);
    auction.active = moment().format(FORMAT_DATE_TIME).toString();

    try {
      await MySql.executeQuery(
        `INSERT INTO auction(auction_date, initial_amount, description, active, id_vehicle) VALUES("${auction.auction_date}", 
        ${auction.initial_amount}, "${auction.description}", "${auction.active}", ${vehicleId});`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ auctionId: data.insertId }];
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

  putAuctionIncrementAmount = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const auctionId = req.params.idAuction;

    const vehicleId = req.params.idVehicle;

    const auction = new ModelAuction();

    let auctions: ModelAuction[] = [];

    let vehicles: ModelVehicle[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_vehicle=${vehicleId} and id_user=${userId} limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = {
        message: "El Vehiculo no existe",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM auction where id_auction="${auctionId}" limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.status(401).json(result);
    }

    !!req.body.increased_amount &&
      (auction.increased_amount = req.body.increased_amount);

    try {
      await MySql.executeQuery(
        `Update auction set increased_amount=${auction.increased_amount} where id_auction=${auctionId};`
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

  getAuctionIdAuctioned = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const auctionId = req.params.id;

    let auctions: ModelAuction[] = [];

    await MySql.executeQuery(
      `SELECT * FROM auction where id_auction="${auctionId}" limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM auctioned where id_auction=${auctionId} and cancelled is null;`
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
