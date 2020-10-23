import bcrypt from "bcrypt";
import { ModelRole } from "../models/role";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";

export const createRoles = async () => {
  try {
    let count: ModelRole[] = [];

    await MySql.executeQuery(
      `SELECT * FROM role`,
      (err: any, role: ModelRole[]) => {
        if (!err) count = role;
      }
    );

    // TODO: corregir error
    console.log(count);

    if (count.length > 0) return;

    const query = `INSERT INTO role(role) VALUES("admin"),("register"),("user")`;

    await MySql.executeQuery(query, (err: any, resp: any) => {
      if (!!resp) count = resp.insertId;
    });

    console.log(count);
  } catch (error) {
    return error;
  }
};

export const createAdmin = async () => {
  let user: ModelUser[] = [];
  let rol: ModelRole[] = [];

  await MySql.executeQuery(
    `SELECT * FROM role where role="admin" || role="register";`,
    (err: any, role: ModelRole[]) => {
      if (!err) rol = role;
    }
  );

  if (rol.length === 0) return;

  await MySql.executeQuery(
    `SELECT * FROM user where email="admin@localhost" limit 1;`,
    (err: any, admin: ModelUser[]) => {
      if (!err) user = admin;
    }
  );

  if (user.length === 0) {
    const admin = new ModelUser();
    admin.email = "admin@localhost";
    admin.name = "admin";
    admin.password = await bcrypt.hash("admin", 10);

    await MySql.executeQuery(
      `INSERT INTO (name, email, password) VALUES (name="${admin.name}",email="${admin.email}", password="${admin.password}" );`,
      (err: any, resp: any) => {
        if (!!resp) admin.id_user = resp.insertId;
      }
    );
  }

  return;
};
