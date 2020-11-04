import { Router } from "express";
import { validate } from "express-validation";
import { Account } from "../classes/account";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import {
  cardValidator,
  creditValidator,
  debtValidator,
} from "../middlewares/validatorsAccount";

export const routerAccount = Router();
const account = new Account();

routerAccount.get("/profile/account/", verificaToken, account.getAcount);
routerAccount.get(
  "/:id/account/",
  verificaToken,
  isRegister,
  account.getAcount
);

routerAccount.get(
  "/profile/account/:idAccount",
  verificaToken,
  account.getAccountId
);

routerAccount.get(
  "/:idUser/account/:idAccount",
  verificaToken,
  isRegister,
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

routerAccount.post(
  "/:idUser/account/:idAccount/credit",
  verificaToken,
  isRegister,
  validate(creditValidator),
  account.postCreditAccount
);

routerAccount.post(
  "/:idUser/account/:idAccount/debt",
  verificaToken,
  isRegister,
  validate(debtValidator),
  account.postDebtAccount
);

routerAccount.get(
  "/profile/account/:idAccount/balance",
  verificaToken,
  account.getBalanceAccount
);

routerAccount.get(
  "/:idUser/account/:idAccount/balance",
  verificaToken,
  isRegister,
  account.getBalanceAccount
);

routerAccount.get(
  "/profile/account/:idAccount/credit",
  verificaToken,
  account.getCreditAccount
);

routerAccount.get(
  "/:idUser/account/:idAccount/credit",
  verificaToken,
  isRegister,
  account.getCreditAccount
);

routerAccount.get(
  "/profile/account/:idAccount/debt",
  verificaToken,
  account.getDebtAccount
);

routerAccount.get(
  "/:idUser/account/:idAccount/debt",
  verificaToken,
  isRegister,
  account.getDebtAccount
);
