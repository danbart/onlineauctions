import { Request, Response } from "express";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";
import { IResponse } from "./interface/IResponse";

export class User {
  private lista: ModelUser[] = [];

  constructor() {}

 
  getUsers = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    try {      
      await MySql.executeQuery(
        `SELECT id_user, name,last_name,email,address,phone,active,avatar,web_site,facebook,twitter,remember_token, created_at, updated_at FROM user`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = data;
        })
        .catch((err) => {
          result.ok = false;
          result.error = err;
        });
  
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };
}
