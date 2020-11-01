import { Request, Response } from "express";
import { ModelCompany } from "../models/company";
import MySql from "../mysql/mysql";
import { IResponse } from "./interface/IResponse";

export class Company {
  getCompany = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {
      await MySql.executeQuery(`SELECT * FROM company`)
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

  getCompanyId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const companyId = req.params.id;

    let companies: ModelCompany[] = [];

    await MySql.executeQuery(
      `SELECT * FROM company where id_company="${companyId}" limit 1;`
    ).then((data: any) => (companies = data));

    if (companies.length === 0) {
      result.error = { message: "La Compania no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM company where id_company="${companyId}" limit 1`
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

  postCompany = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const company = new ModelCompany();

    let companies: ModelCompany[] = [];

    await MySql.executeQuery(
      `SELECT * FROM company where name="${req.body.name}" or email="${req.body.email}" limit 1;`
    ).then((data: any) => (companies = data));

    if (companies.length > 0) {
      result.error = { message: "La Empresa ya existe" };
      return res.json(result);
    }

    !!req.body.name && (company.name = req.body.name);
    !!req.body.email && (company.email = req.body.email);
    !!req.body.phone && (company.phone = req.body.phone);
    !!req.body.addres && (company.addres = req.body.addres);
    !!req.body.mission
      ? (company.mission = req.body.mission)
      : (company.mission = "");
    !!req.body.vision
      ? (company.vision = req.body.vision)
      : (company.vision = "");
    !!req.body.values
      ? (company.values = req.body.values)
      : (company.values = "");
    !!req.body.maximum_profit &&
      (company.maximum_profit = req.body.maximum_profit);
    !!req.body.minimum_profit &&
      (company.minimum_profit = req.body.minimum_profit);

    try {
      await MySql.executeQuery(
        `INSERT INTO company(name,email,phone,addres,mission,vision,\`values\`,maximum_profit,minimum_profit) 
            VALUES("${company.name}", "${company.email}", "${company.phone}", "${company.addres}", "${company.mission}", "${company.vision}",
            "${company.values}", ${company.maximum_profit}, ${company.minimum_profit})`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ companyId: data.insertId }];
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

  putCompany = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const companyId = req.params.id;

    const company = new ModelCompany();

    let companies: ModelCompany[] = [];

    await MySql.executeQuery(
      `SELECT * FROM company where id_company="${companyId}" limit 1;`
    ).then((data: any) => (companies = data));

    if (companies.length === 0) {
      result.error = { message: "La Empresa no existe" };
      return res.json(result);
    }

    !!req.body.name
      ? (company.name = req.body.name)
      : (company.name = companies[0].name);
    !!req.body.email
      ? (company.email = req.body.email)
      : (company.email = companies[0].email);
    !!req.body.phone
      ? (company.phone = req.body.phone)
      : (company.phone = companies[0].phone);
    !!req.body.addres
      ? (company.addres = req.body.addres)
      : (company.addres = companies[0].addres);
    !!req.body.mission
      ? (company.mission = req.body.mission)
      : (company.mission = companies[0].mission);
    !!req.body.vision
      ? (company.vision = req.body.vision)
      : (company.vision = companies[0].vision);
    !!req.body.values
      ? (company.values = req.body.values)
      : (company.values = companies[0].values);
    !!req.body.maximum_profit
      ? (company.maximum_profit = req.body.maximum_profit)
      : (company.maximum_profit = companies[0].maximum_profit);
    !!req.body.minimum_profit
      ? (company.minimum_profit = req.body.minimum_profit)
      : (company.minimum_profit = companies[0].minimum_profit);

    try {
      await MySql.executeQuery(
        `Update company set name="${company.name}",email="${company.email}",phone="${company.phone}",addres="${company.addres}",mission="${company.mission}",
            vision="${company.vision}",\`values\`="${company.values}",maximum_profit=${company.maximum_profit},minimum_profit=${company.minimum_profit} where id_company=${companyId};`
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
