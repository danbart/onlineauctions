import PhoneNumber from "awesome-phonenumber";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ModelRole } from "../models/role";
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

  getUserId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const userId = req.params.id;

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}" limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT id_user, name,last_name,email,address,phone,active,avatar,web_site,facebook,twitter,remember_token, created_at, updated_at FROM user where id_user=${userId}`
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

  postUser = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    const user = new ModelUser();

    let users: ModelUser[] = [];
    let rol: ModelRole[] = [];

    await MySql.executeQuery(`SELECT * FROM role where role="users";`).then(
      (data: any) => (rol = data)
    );

    if (rol.length === 0) {
      result.error = { message: "Error en role de ususario" };
      return res.json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM user where email="${req.body.email}" limit 1;`
    ).then((data: any) => (users = data));

    if (users.length > 0) {
      result.error = { message: "Email ya existe" };
      return res.json(result);
    }

    !!req.body.name && (user.name = req.body.name);
    !!req.body.last_name
      ? (user.last_name = req.body.last_name)
      : (user.last_name = "");
    !!req.body.addres ? (user.addres = req.body.addres) : (user.addres = "");
    !!req.body.email && (user.email = req.body.email);
    user.active = new Date().toJSON().slice(0, 19).replace("T", " ");
    if (!!req.body.phone) {
      const phone = new PhoneNumber(req.body.phone, "GT");
      user.phone = phone.getNumber("e164");
    } else user.phone = "";
    !!req.body.avatar ? (user.avatar = req.body.avatar) : (user.avatar = "");
    !!req.body.web_site
      ? (user.web_site = req.body.web_site)
      : (user.web_site = "");
    !!req.body.facebook
      ? (user.facebook = req.body.facebook)
      : (user.facebook = "");
    !!req.body.twitter
      ? (user.twitter = req.body.twitter)
      : (user.twitter = "");
    !!req.body.password &&
      (user.password = await bcrypt.hash(req.body.password, 10));

    try {
      await MySql.executeQuery(
        `INSERT INTO user(name,last_name,email, password,address,phone,active,avatar,web_site,facebook,twitter) 
        VALUES("${user.name}", "${user.last_name}", "${user.email}", "${user.password}", "${user.addres}", "${user.phone}", "${user.active}", "${user.avatar}", "${user.web_site}",
                "${user.facebook}", "${user.twitter}" )`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ userId: data.insertId }];
          rol.forEach(async (val: ModelRole) => {
            await MySql.executeQuery(
              `INSERT INTO role_user(id_user,id_role) VALUES("${data.insertId}", "${val.id_role}")`
            );
          });
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

  putUser = async (req: Request, res: Response) => {
    const user = new ModelUser();

    const result: IResponse = {
      ok: false,
    };

    const userId = req.params.id;

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}" limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.json(result);
    }

    !!req.body.name && (user.name = req.body.name);
    !!req.body.last_name && (user.last_name = req.body.last_name);
    !!req.body.addres && (user.addres = req.body.addres);
    if (!!req.body.phone) {
      const phone = new PhoneNumber(req.body.phone, "GT");
      user.phone = phone.getNumber("e164");
    }
    !!req.body.avatar && (user.avatar = req.body.avatar);
    !!req.body.web_site && (user.web_site = req.body.web_site);
    !!req.body.facebook && (user.facebook = req.body.facebook);
    !!req.body.twitter && (user.twitter = req.body.twitter);

    try {
      await MySql.executeQuery(
        `UPDATE user SET name="${user.name}",last_name="${user.last_name}", address="${user.addres}",phone="${user.phone}",avatar="${user.avatar}",
        web_site="${user.web_site}",facebook="${user.facebook}",twitter="${user.twitter}" where id_user=${userId};`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ message: data.message }];
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

  loginUser = async (req: Request, res: Response) => {
    const user = new ModelUser();

    const result: IResponse = {
      ok: false,
    };

    !!req.body.email && (user.email = req.body.email);
    !!req.body.password && (user.password = req.body.password);

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT email, password FROM user where email="${user.email}" limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario y Contraseña erroneo" };
      return res.json(result);
    }

    try {
      await MySql.executeQuery(
        `UPDATE user SET name="${user.name}",last_name="${user.last_name}", address="${user.addres}",phone="${user.phone}",avatar="${user.avatar}",
        web_site="${user.web_site}",facebook="${user.facebook}",twitter="${user.twitter}" where id_user=${userId};`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ message: data.message }];
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
