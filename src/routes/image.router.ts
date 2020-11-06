import { Router } from "express";
import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

export const routerImagen = Router();


routerImagen.get("/:tipo/:img", async (req: Request, res: Response) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../docs/upload/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
      res.sendFile(pathImagen);
    } else {
      let noImagePath = path.resolve(__dirname, "../docs/assets/no-image.jpg");

      res.sendFile(noImagePath);
    }
  })