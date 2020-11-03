import { Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../global/environment";

export const userLogin = async (req: Request) => {
  const token = req.get("Authorization") || "";

  const payload: any = jwt.verify(
    token.replace("Bearer ", ""),
    Buffer.from(JWT_PRIVATE_KEY, "base64")
  );

  return payload.id;
};
