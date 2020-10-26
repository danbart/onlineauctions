import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IResponse } from "../classes/interface/IResponse";
import { SEED } from "../global/environment";
import { ModelRole } from "../models/role";
import MySql from "../mysql/mysql";

// =====================
// Verificar Token
// =====================

//request, respuesta y next que indica que el programa continue

export const verificaToken = (
  req: Request,
  res: Response,
  next: CallableFunction
) => {
  const result: IResponse = {
    ok: false,
  };

  // obtiene token
  const token = req.get("Authorization") || "";

  try {
    jwt.verify(
      token.replace("Bearer ", ""),
      Buffer.from(SEED, "base64"),
      (err: any, decoded: any) => {
        if (err) {
          result.error = { message: "Token no Valido" };
          return res.status(401).json(result);
        }
        next();
      }
    );
  } catch (error) {
    result.error = error;
    return res.status(500).json(result);
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: CallableFunction
) => {
  const result: IResponse = {
    ok: false,
  };

  let rol: ModelRole[] = [];

  try {
    const token = req.get("Authorization") || "";

    const payload: any = jwt.verify(
      token.replace("Bearer ", ""),
      Buffer.from(SEED, "base64")
    );

    await MySql.executeQuery(
      `SELECT * FROM role INNER JOIN role_user on role.id_role=role_user.id_role where role.role="admin" && role_user.id_user=${payload.id};`
    ).then((data: any) => (rol = data));

    if (rol.length === 0) {
      result.error = { message: "Error Acceso no Autorizado" };
      return res.status(403).json(result);
    }
  } catch (error) {
    result.error = error;
    return res.status(500).json(result);
  }

  next();
};

export const isRegister = async (
  req: Request,
  res: Response,
  next: CallableFunction
) => {
  const result: IResponse = {
    ok: false,
  };

  let rol: ModelRole[] = [];

  try {
    const token = req.get("Authorization") || "";

    const payload: any = jwt.verify(
      token.replace("Bearer ", ""),
      Buffer.from(SEED, "base64")
    );

    await MySql.executeQuery(
      `SELECT * FROM role INNER JOIN role_user on role.id_role=role_user.id_role where role.role="register" && role_user.id_user=${payload.id};`
    ).then((data: any) => (rol = data));

    if (rol.length === 0) {
      result.error = { message: "Error Acceso no Autorizado" };
      return res.status(403).json(result);
    }
  } catch (error) {
    result.error = error;
    return res.status(500).json(result);
  }

  next();
};
