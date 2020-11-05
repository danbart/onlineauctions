import { IResponse } from "../classes/interface/IResponse";
import MySql from "../mysql/mysql";

export const uploadFile = async (id: number, tipo: string, file: any) => {
  let result: IResponse = {
    ok: false,
  };

  const validTiopo = ["avatar", "vehicle"];
  const extensionesValidas = ["png", "jpg", "jpeg"];

  if (!file) return (result.error = { menssage: "archivo requerido" }), result;

  if (validTiopo.indexOf(tipo) < 0)
    return (result.error = { message: "tipo no valido" }), result;
  console.log(JSON.stringify(file));

  let nombreCortado = file.name.split(".");
  let extencion = nombreCortado[nombreCortado.length - 1];

  if (extensionesValidas.indexOf(extencion) < 0)
    return (result.error = { message: "Extensión no valida" });

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  file.mv(
    `../docs/upload/${tipo}/${nombreArchivo}`,
    () => (result.error = { message: "no se pudo crear el archivo" })
  );

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
      });
  }

  return result;
};
