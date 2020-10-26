import { Request } from "express";
import jwt from "jsonwebtoken";
import { SEED } from "../global/environment";

export const userLogin = async (req: Request) => {
  const token = req.get("Authorization") || "";

  const payload: any = jwt.verify(
    token.replace("Bearer ", ""),
    Buffer.from(SEED, "base64")
  );

  return payload.id;
};
