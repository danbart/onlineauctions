import CryptoJS from "crypto-js";
import { JWT_PRIVATE_KEY } from "../global/environment";

export const cypher = async (str: string) => {
  return CryptoJS.AES.encrypt(str, JWT_PRIVATE_KEY);
};

export const decypher = async (enc: string) => {
  return await CryptoJS.AES.decrypt(enc, JWT_PRIVATE_KEY);
};
