import PhoneNumber from "awesome-phonenumber";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import {
  CADUCIDAD_TOKEN,
  FORMAT_DATE_TIME,
  JWT_PRIVATE_KEY,
} from "../global/environment";
import { ModelAuctioned } from "../models/auctioned";
import { ModelOpinion } from "../models/opinion";
import { ModelRole } from "../models/role";
import { ModelRoleUser } from "../models/roleUser";
import { ModelUser } from "../models/user";
import { ModelVehicle } from "../models/vehicle";
import MySql from "../mysql/mysql";
import { userLogin } from "../utils/jwt";
import { uploadFile } from "../utils/upload";
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
        `SELECT id_user, name,last_name,email,address,phone,active,avatar,web_site,facebook,twitter,remember_token, created_at, updated_at FROM user;`
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
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT id_user, name,last_name,email,address,phone,active,avatar,web_site,facebook,twitter,remember_token, created_at, updated_at FROM user where id_user=${userId};`
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

  getUserIdPublic = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT id_user, name,last_name,avatar,web_site,facebook,twitter FROM user where id_user=${userId};`
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

  getUserRoleId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT r.id_role, r.role FROM role_user ru inner join role r on ru.id_role=r.id_role  where ru.id_user=${userId};`
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

    await MySql.executeQuery(`SELECT * FROM role where role='users';`).then(
      (data: any) => (rol = data)
    );

    if (rol.length === 0) {
      result.error = { message: "Error en role de ususario" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM user where email='${req.body.email}' limit 1;`
    ).then((data: any) => (users = data));

    if (users.length > 0) {
      result.error = { message: "Email ya existe" };
      return res.status(401).json(result);
    }

    !!req.body.name && (user.name = req.body.name);
    !!req.body.last_name
      ? (user.last_name = req.body.last_name)
      : (user.last_name = "");
    !!req.body.addres ? (user.addres = req.body.addres) : (user.addres = "");
    !!req.body.email && (user.email = req.body.email);
    user.active = moment().format(FORMAT_DATE_TIME).toString();
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
        VALUES('${user.name}', '${user.last_name}', '${user.email}', '${user.password}', '${user.addres}', '${user.phone}', '${user.active}', '${user.avatar}', '${user.web_site}',
                '${user.facebook}', '${user.twitter}' );`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [{ userId: data.insertId }];
          rol.forEach(async (val: ModelRole) => {
            await MySql.executeQuery(
              `INSERT INTO role_user(id_user,id_role) VALUES(${data.insertId}, ${val.id_role});`
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
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
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
        `UPDATE user SET name='${user.name}',last_name='${user.last_name}', address='${user.addres}',phone='${user.phone}',
        web_site='${user.web_site}',facebook='${user.facebook}',twitter='${user.twitter}' where id_user=${userId};`
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
      `SELECT id_user, email, password FROM user where email='${user.email}' limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario y Contraseña erróneo" };
      return res.status(401).json(result);
    }

    if (await bcrypt.compare(user.password, Object.values(users)[0].password)) {
      const token = await jwt.sign(
        { id: Object.values(users)[0].id_user },
        Buffer.from(JWT_PRIVATE_KEY, "base64"),
        {
          expiresIn: CADUCIDAD_TOKEN,
        }
      );
      result.data = [{ token: token }];
      result.ok = true;
    } else {
      result.error = { message: "Usuario y Contraseña erróneo" };
    }
    return res.json(result);
  };

  updatePasswordUser = async (req: Request, res: Response) => {
    const user = new ModelUser();

    const result: IResponse = {
      ok: false,
    };

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT id_user, password FROM user where id_user='${userId}' limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
    }

    if (
      !!req.body.old_password &&
      (await bcrypt.compare(
        req.body.old_password,
        Object.values(users)[0].password
      ))
    ) {
      !!req.body.new_password &&
        (user.password = await bcrypt.hash(req.body.new_password, 10));

      try {
        await MySql.executeQuery(
          `UPDATE user SET password='${user.password}' where id_user=${userId};`
        )
          .then((data: any) => {
            result.ok = true;
            result.data = [{ message: data.message }];
          })
          .catch((err) => {
            result.ok = false;
            result.error = err.sqlMessage;
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      result.error = { message: "Su antigua Contraseña es errónea" };
    }
    return res.json(result);
  };

  postUserRoleCreate = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;

    const rol = new ModelRole();
    let roles: ModelRole[] = [];
    let rolesUser: ModelRole[] = [];
    let rolUser: ModelRoleUser[] = [];

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(`SELECT * FROM role;`).then(
      (data: any) => (roles = data)
    );

    if (roles.length === 0) {
      result.error = { message: "Error en roles de ususario" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM role_user where id_user=${userId};`
    ).then((data: any) => (rolUser = data));

    if (rolUser.length === 0) {
      result.error = { message: "Error en roles de ususario" };
      roles.forEach(async (val: ModelRole) => {
        if (val.role === "users") {
          await MySql.executeQuery(
            `INSERT INTO role_user(id_user,id_role) VALUES(${userId}, ${val.id_role});`
          );
        }
      });
      return res.status(401).json(result);
    }

    !!req.body.role && (rol.role = req.body.role);

    try {
      for (let val of roles) {
        if (val.role === rol.role) {
          await MySql.executeQuery(
            `SELECT r.* FROM role r inner join role_user ru on r.id_role=ru.id_role where ru.id_user=${userId} and r.role='${rol.role}';`
          ).then((data: any) => (rolesUser = data));

          if (rolesUser.length > 0) {
            result.error = {
              message: "Error ya cuenta con ese role de ususario",
            };
            return res.status(401).json(result);
          }

          if (rol.role === "admin") {
            await MySql.executeQuery(
              `SELECT * FROM role where role='register';`
            ).then((data: any) => (rolesUser = data));

            if (rolesUser.length > 0) {
              await MySql.executeQuery(
                `INSERT INTO role_user(id_user,id_role) VALUES(${userId}, ${rolesUser[0].id_role});`
              );
            }
          }
          await MySql.executeQuery(
            `SELECT * FROM role where role='${rol.role}';`
          ).then((data: any) => (rolesUser = data));

          if (rolesUser.length > 0) {
            await MySql.executeQuery(
              `INSERT INTO role_user(id_user,id_role) VALUES(${userId}, ${rolesUser[0].id_role});`
            )
              .then((data: any) => {
                result.ok = true;
                result.data = [{ message: "Rol cargado correctamente" }];
              })
              .catch((err) => {
                result.ok = false;
                result.error = err.sqlMessage;
              });
            return res.json(result);
          }
          return res.status(401).json(result);
        }
      }
      result.error = { message: "Rol no Existe" };
      return res.json(result);
    } catch (error) {
      console.log(error);
    }
  };

  deleteUserRole = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;

    const rol = new ModelRole();
    let roles: ModelRole[] = [];
    let rolesUser: ModelRole[] = [];
    let rolUser: ModelRoleUser[] = [];

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(`SELECT * FROM role;`).then(
      (data: any) => (roles = data)
    );

    if (roles.length === 0) {
      result.error = { message: "Error en roles de ususario" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM role_user where id_user=${userId};`
    ).then((data: any) => (rolUser = data));

    if (rolUser.length === 0) {
      result.error = { message: "Error en roles de ususario" };
      roles.forEach(async (val: ModelRole) => {
        if (val.role === "users") {
          await MySql.executeQuery(
            `INSERT INTO role_user(id_user,id_role) VALUES(${userId}, ${val.id_role});`
          );
        }
      });
      return res.status(401).json(result);
    }

    !!req.body.role && (rol.role = req.body.role);

    try {
      for (let val of roles) {
        if (val.role === rol.role) {
          await MySql.executeQuery(
            `SELECT r.* FROM role r inner join role_user ru on r.id_role=ru.id_role where ru.id_user=${userId} and r.role='${rol.role}';`
          ).then((data: any) => (rolesUser = data));

          if (rolesUser.length === 0) {
            result.error = {
              message: "Error no cuenta con ese role de ususario",
            };
            return res.status(401).json(result);
          }

          if (rol.role === "users") {
            result.error = {
              message: "Error no puede eliminar el role de ususario",
            };
            return res.status(401).json(result);
          }

          if (rol.role === "register") {
            await MySql.executeQuery(
              `SELECT * FROM role where role='admin';`
            ).then((data: any) => (rolesUser = data));

            if (rolesUser.length > 0) {
              await MySql.executeQuery(
                `DELETE FROM role_user WHERE (id_user = ${userId}) and (id_role =  ${rolesUser[0].id_role});`
              );
            }
          }

          if (rol.role === "admin") {
            await MySql.executeQuery(
              `SELECT * FROM role where role='register';`
            ).then((data: any) => (rolesUser = data));

            if (rolesUser.length > 0) {
              await MySql.executeQuery(
                `DELETE FROM role_user WHERE (id_user = ${userId}) and (id_role =  ${rolesUser[0].id_role});`
              );
            }
          }
          await MySql.executeQuery(
            `SELECT * FROM role where role='${rol.role}';`
          ).then((data: any) => (rolesUser = data));

          if (rolesUser.length > 0) {
            await MySql.executeQuery(
              `DELETE FROM role_user WHERE (id_user = ${userId}) and (id_role =  ${rolesUser[0].id_role});`
            )
              .then((data: any) => {
                result.ok = true;
                result.data = [{ message: "Rol eliminado correctamente" }];
              })
              .catch((err) => {
                result.ok = false;
                result.error = err.sqlMessage;
              });
            return res.json(result);
          }
          return res.status(401).json(result);
        }
      }
      result.error = { message: "Rol no Existe" };
      return res.json(result);
    } catch (error) {
      console.log(error);
    }
  };

  postAvatar = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };
    let userId = req.params.id;

    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let users: ModelUser[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = {
        message: "Usuario no Existe",
      };
      return res.status(401).json(result);
    }

    if (!!users[0].avatar) {
      result.error = {
        message: "Usuario ya cuenta con avatar",
      };
      return res.status(401).json(result);
    }

    if (!req.files) {
      result.error = { menssage: "archivo requerido" };
      return res.json(result);
    }

    const resp = await uploadFile(parseInt(userId), "avatar", req);

    res.json(resp);
  };

  getProfileAuctioneds = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    let auctioneds: ModelAuctioned[] = [];

    await MySql.executeQuery(
      `SELECT * FROM auctioned where id_user=${userId} limit 1;`
    ).then((data: any) => (auctioneds = data));

    if (auctioneds.length === 0) {
      result.error = { message: "No ha subastado" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM auctioned where id_user=${userId} order by created_at desc;`
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

  getProfileVehicles = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = 0;
    await userLogin(req).then((res) => (userId = res));

    let vehicles: ModelVehicle[] = [];

    await MySql.executeQuery(
      `SELECT * FROM vehicle where id_user=${userId} limit 1;`
    ).then((data: any) => (vehicles = data));

    if (vehicles.length === 0) {
      result.error = { message: "No Tiene Vehiculos" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT v.*, s.state, bs.style, t.type 
        FROM vehicle v INNER JOIN state s on v.id_state=s.id_state INNER JOIN body_style bs on v.id_body_style=bs.id_body_style
        INNER JOIN type t on v.id_type=t.id_type where v.id_user=${userId} order by v.created_at desc;`
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

  getUserRatingId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;
    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let users: ModelUser[] = [];
    let opinios: ModelOpinion[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no Existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM opinion where id_user_opined=${userId};`
    ).then((data: any) => (opinios = data));

    if (opinios.length === 0) {
      result.error = { message: "Usuario no tiene opiniones" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `select id_user_opined, avg(rating) as rating from opinion where id_user_opined=${userId} group by id_user_opined;`
      )
        .then((data: any) => {
          result.ok = true;
          result.data = [data, opinios];
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

  getUserCommentedId = async (req: Request, res: Response) => {
    const result: IResponse = {
      ok: false,
    };

    let userId = req.params.id;
    if (!userId) {
      await userLogin(req).then((res) => (userId = res));
    }

    let users: ModelUser[] = [];
    let opinios: ModelOpinion[] = [];

    await MySql.executeQuery(
      `SELECT * FROM user where id_user=${userId} limit 1;`
    ).then((data: any) => (users = data));

    if (users.length === 0) {
      result.error = { message: "Usuario no Existe" };
      return res.status(401).json(result);
    }

    await MySql.executeQuery(
      `SELECT * FROM opinion where id_user_say=${userId};`
    ).then((data: any) => (opinios = data));

    if (opinios.length === 0) {
      result.error = { message: "Usuario no tiene Comentarios" };
      return res.status(401).json(result);
    }

    try {
      await MySql.executeQuery(
        `SELECT * FROM opinion where id_user_say=${userId};`
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
