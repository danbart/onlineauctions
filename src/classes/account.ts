import { Request, Response } from "express";
import moment from "moment";
import { ModelAccount } from "../models/account";
import { ModelCreditCard } from "../models/creditCard";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";
import { cypher, decypher } from "../utils/cryptoCreditCard";
import { userLogin } from "../utils/jwt";
import { IResponse } from "./interface/IResponse";

export class Account {
  getAcount = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let accounts: ModelAccount[] = [];

    await MySql.executeQuery(
      `SELECT * FROM account where id_user="${userId}";`
    ).then((data: any) => (accounts = data));

    if (accounts.length === 0) {
      result.error = { message: "Usuario no tiene cuentas" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT ac.*, cc.id_credit_card, cc.expiration_date, cc.created_at as created_at_card, cc.updated_at as updated_at_card  
        FROM account ac INNER JOIN credit_card cc on ac.id_account=cc.id_account where ac.id_user=${userId}`
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

  getAccountId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const accountId = req.params.idAccount;
    let userId = req.params.idUser;

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let accounts: ModelAccount[] = [];

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}";`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = {
        message: "Usuario no existe",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM account where id_user="${userId}" and  id_account=${accountId};`
    ).then((data: any) => (accounts = data));

    if (accounts.length === 0) {
      result.error = {
        message: "La cuenta no Existe",
      };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT  ac.*, cc.id_credit_card, cc.expiration_date, cc.created_at as created_at_card, cc.updated_at as updated_at_card  
        FROM account ac INNER JOIN credit_card cc on ac.id_account=cc.id_account where ac.id_user=${userId} and ac.id_account=${accountId};`
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

  postAccount = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const creditCard = new ModelCreditCard();
    const account = new ModelAccount();

    let accounts: ModelAccount[] = [];

    let users: ModelUser[] = [];

    let userId = req.params.id;

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}";`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = {
        message: "Usuario no existe",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM account where id_user="${userId}" and active is null;`
    ).then((data: any) => (accounts = data));

    if (accounts.length === 0) {
      result.error = {
        message: "Usuario ya tiene cuenta",
      };
      return res.status(401).json(result);
    }

    !!userId && (account.id_user = parseInt(userId));
    account.active = moment().format("YYYY-M-D H:mm:ss").toString();
    !!req.body.card_number &&
      (creditCard.card_number = (
        await cypher(req.body.card_number)
      ).toString());
    if (!!req.body.expiration_date) {
      const date = req.body.expiration_date.split("/", 2);
      creditCard.expiration_date = date[1] + "-" + date[0] + "-01";
      if (moment(creditCard.expiration_date).diff(moment()) <= 0) {
        result.error = {
          message: "Tarjeta Expirada",
        };
        return res.status(401).json(result);
      }
    }
    !!req.body.cvc_code &&
      (creditCard.cvc_code = (await cypher(req.body.cvc_code)).toString());

    try {
      await MySql.executeQuery(
        `INSERT INTO account(id_user, active) VALUES(${account.id_user}, "${account.active}" );`
      )
        .then(async (data: any) => {
          result.ok = true;
          result.data = [{ accountId: data.insertId }];
          await MySql.executeQuery(
            `INSERT INTO credit_card(card_number, expiration_date, cvc_code, id_account)
            values("${creditCard.card_number}", "${creditCard.expiration_date}", "${creditCard.cvc_code}", ${data.insertId});`
          );
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

  putAccountDesactive = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const userId = req.params.idUser;
    const accountId = req.params.idAccount;

    const account = new ModelAccount();

    let users: ModelUser[] = [];
    let accounts: ModelAccount[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}";`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = {
        message: "Usuario no existe",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM account where id_account="${accountId}" limit 1;`
    ).then((data: any) => (accounts = data));

    if (accounts.length === 0) {
      result.error = { message: "Cuenta no existe" };
      return res.json(result);
    }

    account.deleted_at = moment().format("YYYY-M-D H:mm:ss").toString();

    try {
      await MySql.executeQuery(
        `Update account set deleted_at="${account.deleted_at}", active=null where id_account=${accountId} and id_user=${userId};`
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

  postCreditCard = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const creditCard = new ModelCreditCard();

    let accounts: ModelAccount[] = [];
    let creditCards: ModelCreditCard[] = [];
    let users: ModelUser[] = [];

    let userId = req.params.idUser;
    let accountId = req.params.idAccount;

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}";`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = {
        message: "Usuario no existe",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM account where id_user="${userId}" and id_account=${accountId} and active is null;`
    ).then((data: any) => (accounts = data));

    if (accounts.length > 0) {
      result.error = {
        message: "Cuenta no Existe o esta desactivada",
      };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM credit_card where id_account="${accountId}";`
    ).then((data: any) => (creditCards = data));

    const card_number = (await cypher(req.body.card_number)).toString();
    const reqCard = (await decypher(card_number)).toString();
    let bandera = 0;

    for (let card of creditCards) {
      const cardDB = (await decypher(card.card_number)).toString();
      if (reqCard === cardDB) {
        result.error = {
          message: "Tarjeta Existe",
        };
        bandera += 1;
        break;
      }
    }

    if (bandera > 0) return res.status(401).json(result);

    !!req.body.card_number &&
      (creditCard.card_number = (
        await cypher(req.body.card_number)
      ).toString());
    if (!!req.body.expiration_date) {
      const date = req.body.expiration_date.split("/", 2);
      creditCard.expiration_date = date[1] + "-" + date[0] + "-01";
      if (moment(creditCard.expiration_date).diff(moment()) <= 0) {
        result.error = {
          message: "Tarjeta Expirada",
        };
        return res.status(401).json(result);
      }
    }
    !!req.body.cvc_code &&
      (creditCard.cvc_code = (await cypher(req.body.cvc_code)).toString());

    try {
      await MySql.executeQuery(
        `INSERT INTO credit_card(card_number, expiration_date, cvc_code, id_account)
            values("${creditCard.card_number}", "${creditCard.expiration_date}", "${creditCard.cvc_code}", ${accountId});`
      )
        .then(async (data: any) => {
          result.ok = true;
          result.data = [{ creditCardId: data.insertId }];
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
