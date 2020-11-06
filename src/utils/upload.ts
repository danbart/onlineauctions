import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { IResponse } from "../classes/interface/IResponse";
import MySql from "../mysql/mysql";
import { IFiles } from "./interfaz/IFiles";

export const uploadFile = async (id: number, tipo: string, req: Request) => {
  let result: IResponse = {
    ok: false,
  };

  const validTiopo = ["avatar", "vehicle"];
  const extensionesValidas = ["png", "jpg", "jpeg"];

  if (!req.files) {
    result.error = { menssage: "archivo requerido" };
    return result;
  }

  if (validTiopo.indexOf(tipo) < 0) {
    result.error = { message: "tipo no valido" };
    return result;
  }

  const archivo: IFiles = req.files.archivo;

  let nombreCortado = archivo.name.split(".");
  let extencion = nombreCortado[nombreCortado.length - 1];

  if (extensionesValidas.indexOf(extencion) < 0)
    return (result.error = { message: "Extensión no valida" });

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  await archivo.mv(`src/docs/upload/${tipo}/${nombreArchivo}`, (err: any) => {
    if (err) {
      result.ok = false;
      result.error = err;
      return;
    }
    return (result.ok = true);
  });

  if (tipo === "avatar") {
    await MySql.executeQuery(
      `Update user set avatar="${nombreArchivo}" where id_user=${id}`
    )
      .then((data: any) => {
        result.ok = true;
        result.data = [
          { avatar: nombreArchivo, idUser: id, message: data.message },
        ];
      })
      .catch((err) => {
        result.error = err.sqlMessage;
        borrarArchivo(nombreArchivo, tipo);
      });
  } else {
    await MySql.executeQuery(
      `INSERT INTO photo(photo, id_vehicle) values("${nombreArchivo}", ${id});`
    )
      .then((data: any) => {
        result.ok = true;
        result.data = [
          { photo: nombreArchivo, idVehicle: id, idPhoto: data.insertId },
        ];
      })
      .catch((err) => {
        result.error = err.sqlMessage;
        borrarArchivo(nombreArchivo, tipo);
      });
  }

  return result;
};

const borrarArchivo = (nombre: string, tipo: string) => {
  let pathImage = path.resolve(__dirname, `../docs/upload/${tipo}/${nombre}`);
  if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);
};
