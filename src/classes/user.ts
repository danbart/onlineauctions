import PhoneNumber from "awesome-phonenumber";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CADUCIDAD_TOKEN, SEED } from "../global/environment";
import { ModelRole } from "../models/role";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";
import { userLogin } from "../utils/jwt";
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
          result.error = err.sqlMessage;
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

    let userId = req.params.id;

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

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
          result.error = err.sqlMessage;
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
          result.error = err.sqlMessage;
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

    let userId = req.params.id;

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user="${userId}" limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.json(result);
    }

    !!req.body.name ? (user.name = req.body.name) : (user.name = users[0].name);
    !!req.body.last_name
      ? (user.last_name = req.body.last_name)
      : (user.last_name = users[0].last_name);
    !!req.body.addres
      ? (user.addres = req.body.addres)
      : (user.addres = users[0].addres);
    if (!!req.body.phone) {
      const phone = new PhoneNumber(req.body.phone, "GT");
      user.phone = phone.getNumber("e164");
    } else user.phone = users[0].phone;
    !!req.body.web_site
      ? (user.web_site = req.body.web_site)
      : (user.web_site = users[0].web_site);
    !!req.body.facebook
      ? (user.facebook = req.body.facebook)
      : (user.facebook = users[0].facebook);
    !!req.body.twitter
      ? (user.twitter = req.body.twitter)
      : (user.twitter = users[0].twitter);

    try {
      await MySql.executeQuery(
        `UPDATE user SET name="${user.name}",last_name="${user.last_name}", address="${user.addres}",phone="${user.phone}",
        web_site="${user.web_site}",facebook="${user.facebook}",twitter="${user.twitter}" where id_user=${userId};`
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

  loginUser = async (req: Request, res: Response) => {
    const user = new ModelUser();

    const result: IResponse = {
      ok: false,
    };

    !!req.body.email && (user.email = req.body.email);
    !!req.body.password && (user.password = req.body.password);

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT id_user, email, password FROM user where email="${user.email}" limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario y Contraseña erroneo" };
      return res.json(result);
    }

    if (await bcrypt.compare(user.password, Object.values(users)[0].password)) {
      const token = await jwt.sign(
        { id: Object.values(users)[0].id_user },
        Buffer.from(SEED, "base64"),
        {
          expiresIn: CADUCIDAD_TOKEN,
        }
      );
      result.data = [{ token: token }];
      result.ok = true;
    } else {
      result.error = { message: "Usuario y Contraseña erroneo" };
    }
    return res.json(result);
  };
}
