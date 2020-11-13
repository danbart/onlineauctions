import { Request, Response } from "express";
import moment from "moment";
import { FORMAT_DATE_TIME } from "../global/environment";
import { ModelAccount } from "../models/account";
import { ModelAuction } from "../models/auction";
import { ModelAuctioned } from "../models/auctioned";
import { ModelCompany } from "../models/company";
import { ModelPayment } from "../models/payment";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";
import { balanceDebt } from "../utils/balance";
import { userLogin } from "../utils/jwt";
import { profitCalc } from "../utils/profitCalc";
import { IResponse } from "./interface/IResponse";

export class Payment {
  getSellerUserID = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;
    let sellers: ModelPayment[] = [];
    let users: ModelUser[] = [];

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no Existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM payment where id_user_seller=${userId} limit 1;`
    ).then((data: any) => (sellers = data));

    if (sellers.length === 0) {
      result.error = { message: "usuario no tiene ventas" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT u.name, u.last_name, pay.*, v.vin, v.id_vehicle, v.model 
      FROM user u inner join payment pay on u.id_user=pay.id_user_seller inner join auction ac on pay.id_auction=ac.id_auction 
      inner join vehicle v on ac.id_vehicle=v.id_vehicle where u.id_user=${userId};`
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

  getBuyerUserId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;
    let sellers: ModelPayment[] = [];

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    await MySql.executeQuery(
      `SELECT * FROM payment where id_user_buyer=${userId} limit 1;`
    ).then((data: any) => (sellers = data));

    if (sellers.length === 0) {
      result.error = { message: "usuario no tiene compras" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT u.name, u.last_name, pay.*, v.vin, v.id_vehicle, v.model 
      FROM user u inner join payment pay on u.id_user=pay.id_user_buyer inner join auction ac on pay.id_auction=ac.id_auction 
      inner join vehicle v on ac.id_vehicle=v.id_vehicle where u.id_user=${userId};`
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

  postPayment = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.idUser;
    let auctionId = req.params.idAuction;
    let auctions: ModelAuction[] = [];
    let auctioneds: ModelAuctioned[] = [];
    let accountsBuy: ModelAccount[] = [];
    let accountsSeller: ModelAccount[] = [];
    let company: ModelCompany[] = [];

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    await MySql.executeQuery(`SELECT * FROM company limit 1;`).then(
      (data: any) => (company = data)
    );

    if (company.length === 0) {
      result.error = { message: "Company no Existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM auction where id_auction=${auctionId} and finished is null limit 1;`
    ).then((data: any) => (auctions = data));

    if (auctions.length === 0) {
      result.error = { message: "Subasta no Existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `select au.* from auctioned au inner join auction act on au.id_auction=act.id_auction inner join vehicle v on act.id_vehicle=v.id_vehicle
      where au.id_auction=${auctionId} and au.cancelled is null and au.id_user!=v.id_user order by au.amount desc limit 1`
    ).then((data: any) => (auctioneds = data));

    if (auctioneds.length === 0) {
      result.error = { message: "No existen subastas" };
      return res.status(401).json(result);
    }

    if (parseInt(userId) === auctioneds[0].id_user) {
      let cont = [];
      await MySql.executeQuery(
        `SELECT count(id_user_buyer) as cont FROM payment where id_user_buyer=${userId} group by dayofyear(created_at);`
      ).then((data: any) => (cont = data));

      if (cont.length >= 10) {
        result.error = {
          message: "usuario no puede realizar mas de 10 compras al día",
        };
        return res.status(401).json(result);
      }

      await MySql.executeQuery(
        `SELECT * FROM account where id_user=${userId} and active is not null limit 1;`
      ).then((data: any) => (accountsBuy = data));

      if (accountsBuy.length === 0) {
        result.error = { message: "usuario no tiene cuenta solicite una" };
        return res.status(401).json(result);
      }

      const credit = await balanceDebt(
        accountsBuy[0].id_account,
        parseInt(userId),
        auctioneds[0].amount
      );

      if (credit <= 0) {
        result.error = {
          message: "usuario no tiene Credito para hacer la compra",
        };
        return res.status(401).json(result);
      }

      await MySql.executeQuery(
        `SELECT ac.* 
        FROM account ac inner join user u on ac.id_user=u.id_user inner join 
        vehicle v on u.id_user=v.id_user inner join auction au on v.id_vehicle=au.id_vehicle
        where au.id_auction=${auctionId} and ac.active is not null limit 1;`
      ).then((data: any) => (accountsSeller = data));

      if (accountsSeller.length === 0) {
        result.error = { message: "usuario no tiene cuenta solicite una" };
        return res.status(401).json(result);
      }

      const respuesta = await profitCalc(
        company[0].id_company,
        auctioneds[0].amount
      );

      if (respuesta.length === 0) {
        result.error = {
          message: "Error al calcular los impuestos",
        };
        return res.status(401).json(result);
      }

      try {
        await MySql.executeQuery(
          `INSERT INTO payment(amount, paid_type, discount, tax, sold, id_user_seller, id_user_buyer,id_auction) 
            VALUES('${auctioneds[0].amount}', '${accountsBuy[0].id_account}', ${respuesta[0]}, ${respuesta[1]}, ${respuesta[2]}, 
              ${accountsSeller[0].id_user}, ${accountsBuy[0].id_user}, ${auctionId});`
        )
          .then(async (data: any) => {
            result.ok = true;
            result.data = [{ stateId: data.insertId }];

            await MySql.executeQuery(`INSERT INTO profitability(profit, amount, id_payment,id_company) 
              values(${respuesta[3]}, ${respuesta[0]}, ${data.insertId}, ${company[0].id_company});`);

            await MySql.executeQuery(`INSERT INTO debt (id_account, amount, reason) 
              values(${accountsBuy[0].id_account}, ${auctioneds[0].amount}, 'Compra de vehiculo de la subasta No. ${auctionId} con un monto de ${auctioneds[0].amount}');`);

            await MySql.executeQuery(`INSERT INTO credit (id_account, amount, reason, paid_type) 
              values(${accountsSeller[0].id_account}, ${respuesta[2]}, 'Venta de vehiculo de la subasta No. ${auctionId} con un monto de ${respuesta[2]}', 
              'Transferencia de cuenta ${accountsBuy[0].id_account}');`);

            await MySql.executeQuery(
              `UPDATE auction set sold=${
                respuesta[2]
              }, finished='${moment().format(
                FORMAT_DATE_TIME
              )}' where id_auction=${auctionId};`
            );

            await MySql.executeQuery(
              `UPDATE vehicle set sold='${moment().format(
                FORMAT_DATE_TIME
              )}' where id_vehicle=${auctions[0].id_vehicle};`
            );
          })
          .catch((err) => {
            result.ok = false;
            result.error = err.sqlMessage;
          });

        return res.json(result);
      } catch (error) {
        console.log(error);
      }
      result.error = { message: "Usuario no gano la subasta" };
      return res.status(401).json(result);
    }
  };
}
