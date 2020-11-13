import { Request, Response } from "express";
import moment from "moment";
import { FORMAT_DATE_TIME } from "../global/environment";
import { ModelAccount } from "../models/account";
import { ModelAuction } from "../models/auction";
import { ModelAuctioned } from "../models/auctioned";
import { ModelPhoto } from "../models/photo";
import { ModelVehicle } from "../models/vehicle";
import MySql from "../mysql/mysql";
import { twominutes } from "../utils/converTimeZone";
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
      `SELECT * FROM auction where id_auction=${auctionId} limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM auction where id_auction=${auctionId} limit 1;`
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

    let accouts: ModelAccount[] = [];

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
      `SELECT * FROM account where id_user=${userId} and active is not null limit 1;`
    ).then((data: any) => (accouts = data));

    if (accouts.length === 0) {
      result.error = { message: "usuario no tiene cuenta solicite una" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM photo where id_vehicle=${vehicleId};`
    ).then((data: any) => (photos = data));

    if (photos.length < 3) {
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
        `INSERT INTO auction(auction_date, initial_amount, description, active, id_vehicle) VALUES('${auction.auction_date}', 
        ${auction.initial_amount}, '${auction.description}', '${auction.active}', ${vehicleId});`
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
      `SELECT * FROM auction where id_auction=${auctionId} limit 1;`
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
      `SELECT * FROM auction where id_auction=${auctionId} limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.status(401).json(result);
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

  getAuctionIdAuctionedId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const auctionId = req.params.idAuction;

    const auctionedId = req.params.idAuctioned;

    let auctions: ModelAuction[] = [];
    let auctioneds: ModelAuctioned[] = [];

    await MySql.executeQuery(
      `SELECT * FROM auction where id_auction=${auctionId} limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM auctioned where id_auctioned=${auctionedId} and cancelled is null limit 1;`
    ).then((data: any) => (auctioneds = data));

    if (auctioneds.length === 0) {
      result.error = { message: "Subasta no existe o ha sido cancelada" };
      return res.status(401).json(result);
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

  postAuctionIdAuctioned = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const auctionId = req.params.id;

    let auctions: ModelAuction[] = [];

    const auctioned = new ModelAuctioned();

    let auctioneds: ModelAuctioned[] = [];

    let vehicles: ModelVehicle[] = [];

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    await MySql.executeQuery(
      `SELECT * FROM auction where id_auction=${auctionId} limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT v.* FROM auction au inner join vehicle v on au.id_vehicle=v.id_vehicle where au.id_auction=${auctionId} and v.id_user=${userId} limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length > 0) {
      result.error = { message: "No puede subastar su propio vehiculo" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `select * from auctioned where id_user=${userId} and cancelled is null order by created_at desc limit 1;`
    ).then((data: any) => (auctioneds = data));

    console.log(moment().subtract(1, "day").calendar());
    const gthora =
      auctioneds.length > 0 &&
      twominutes(moment(auctioneds[0].created_at).format(FORMAT_DATE_TIME));

    if (
      auctioneds.length > 0 &&
      moment(gthora.toString()).diff(moment(), "minute") >= 0 &&
      moment(gthora.toString()).diff(moment(), "minute") <= 2
    ) {
      result.error = {
        message: "Tiene que esperar 2 minutos para volver a subastar",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `select max(amount) as amount from auctioned where id_auction=${auctionId} and cancelled is null limit 1;`
    ).then((data: any) => (auctioneds = data));

    !!req.body.amount && (auctioned.amount = req.body.amount);

    if (
      moment(auctions[0].auction_date).diff(moment()) <= 0 ||
      !!auctions[0].finished
    ) {
      result.error = {
        message: "No puede subastar por que la subasta ha caducado",
      };
      return res.status(401).json(result);
    }

    if (auctioneds.length > 0 && auctioneds[0].amount >= auctioned.amount) {
      result.error = {
        message:
          "El monto a subastar tiene que ser mayor ultimo monto ofertado " +
          auctioneds[0].amount,
      };
      return res.status(401).json(result);
    }

    if (
      !!auctions[0].increased_amount &&
      auctions[0].increased_amount > auctioned.amount
    ) {
      result.error = {
        message:
          "El monto a subastar tiene que ser mayor al indicado por el cliente " +
          auctions[0].increased_amount,
      };
      return res.status(401).json(result);
    }

    if (auctions[0].initial_amount > auctioned.amount) {
      result.error = {
        message:
          "El monto a subastar tiene que ser mayor al indicado por el cliente " +
          auctions[0].initial_amount,
      };
      return res.status(401).json(result);
    }
    !!req.body.description
      ? (auctioned.description = req.body.description)
      : (auctioned.description = "");

    try {
      await MySql.executeQuery(
        `INSERT INTO auctioned(amount,description,id_auction,id_user) 
        VALUES(${auctioned.amount}, '${auctioned.description}', ${auctionId}, ${userId});`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ auctionedId: data.insertId }];
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
