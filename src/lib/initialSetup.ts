import bcrypt from "bcrypt";
import { ModelRole } from "../models/role";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";

export const createRoles = async () => {
  let count: ModelRole[] = [];

  await MySql.executeQuery(`SELECT * FROM role`)
    .then((data: any) => (count = data))
    .catch(console.log);

  if (count.length > 0) return;

  const query = `INSERT INTO role(role) VALUES("admin"),("register"),("users")`;

  return await MySql.executeQuery(query).then(console.log);
};

export const createAdmin = async () => {
  let users: ModelUser[] = [];
  let rol: ModelRole[] = [];

  await MySql.executeQuery(
    `SELECT * FROM role where role="admin" || role="register";`
  ).then((data: any) => (rol = data));

  if (rol.length === 0) return;

  await MySql.executeQuery(
    `SELECT * FROM user where email="admin@localhost" limit 1;`
  ).then((data: any) => (users = data));

  if (users.length === 0) {
    const admin = new ModelUser();
    admin.email = "admin@localhost";
    admin.name = "admin";
    admin.active = new Date().toJSON().slice(0, 19).replace("T", " ");
    admin.password = await bcrypt.hash("admin", 10);

    await MySql.executeQuery(
      `INSERT INTO user(name, email,active, password) VALUES ("${admin.name}","${admin.email}", "${admin.active}","${admin.password}" );`
    )
      .then((data: any) => {
        rol.forEach(async (val: ModelRole) => {
          await MySql.executeQuery(
            `INSERT INTO role_user(id_user,id_role) VALUES("${data.insertId}", "${val.id_role}")`
          );
        });
      })
      .catch(console.log);
  }
};
