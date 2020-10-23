import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { validate } from "express-validation";
import validator from "validator";
import { registerValidator } from "../middlewares/validators";
import { ModelUser } from "../models/user";
import MySql from "../mysql/mysql";
import Server from "../server/server";
import { usuariosConectados } from "../sockets/socket";
import { routeUser } from "./user.route";

const router = Router();

router.use("/user/", routeUser);
// ================= get / =======================
// router.get(
//   "/user/",
//   /*verificaToken,*/ async (req: Request, res: Response) => {
//     const query = usuariosConectados.getLista();

//     try {
//       await MySql.executeQuery(query, (err: any, usuarios: ModelUser[]) => {
//         if (err) {
//           res.json({
//             ok: false,
//             error: err,
//           });
//         } else {
//           res.json({
//             ok: true,
//             user: usuarios,
//           });
//         }
//       });
//     } catch (error) {
//       return error.sqlMessage;
//     }
//   }
// );
// TODO: validar el email
router.post(
  "/user/",
  validate(registerValidator),
  async (req: Request, res: Response) => {
    const body = req.body;

    const user = new ModelUser();
    user.name = body.name;
    user.last_name = body.surname;
    user.email = body.email;
    user.password = bcrypt.hashSync(body.password, 10);

    if (!user.email == null && !user.password == null) {
      res.json({
        ok: false,
        mensaje: "Email y password son requeridas",
      });
    }
    // const server = Server.instance;
    // server.io.emit('mensaje-nuevo', payload);
    const query = usuariosConectados.agregar(user);

    MySql.executeQuery(query, (err: any, usuario: any) => {
      if (!!usuario) {
        res.json({
          ok: true,
          User_id: usuario.insertId,
          mensaje: "Usuario Registrado correctamente",
        });
      } else {
        res.json({
          ok: false,
          mensaje: err.sqlMessage,
        });
      }
    });
  }
);

router.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (validator.isNumeric(id)) {
    const query = usuariosConectados.getLista(Number(id));

    try {
      MySql.executeQuery(query, (err: any, usuarios: ModelUser[]) => {
        if (err) {
          res.json({
            ok: false,
            error: err,
          });
        } else {
          res.json({
            ok: true,
            user: usuarios,
          });
        }
      });
    } catch (error) {
      return error.sqlMessage;
    }
  } else {
    res.json({
      ok: false,
      error: "El registro solicitado no existe",
    });
  }
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const server = Server.instance;

  const payload = {
    de,
    cuerpo,
  };

  server.io.in(id).emit("mensaje-privado", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  });
});

// Servicios para obtener todos los IDs de los usuarios
router.get("/users", (req: Request, res: Response) => {
  const server = Server.instance;

  server.io.clients((err: any, clientes: string[]) => {
    if (err) {
      return res.json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      clientes,
    });
  });
});

// Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista(),
  });
});

export default router;
