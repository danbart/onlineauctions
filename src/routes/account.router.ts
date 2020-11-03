import { Router } from "express";
import { validate } from "express-validation";
import { Account } from "../classes/account";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import { cardValidator } from "../middlewares/validatorsCreditCard";

export const routerAccount = Router();
const account = new Account();

routerAccount.get("/:id/account/", verificaToken, account.getAcount);
routerAccount.get(
  "/:idUser/account/:idAccount",
  verificaToken,
  account.getAccountId
);
routerAccount.post(
  "/:id/account/",
  verificaToken,
  isRegister,
  validate(cardValidator),
  account.postAccount
);
routerAccount.put(
  "/:idUser/account/:idAccount",
  verificaToken,
  isAdmin,
  account.putAccountDesactive
);
routerAccount.post(
  "/:idUser/account/:idAccount",
  verificaToken,
  isRegister,
  validate(cardValidator),
  account.postCreditCard
);
