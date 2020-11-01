import { Router } from "express";
import { validate } from "express-validation";
import { Company } from "../classes/company";
import { isAdmin, verificaToken } from "../middlewares/autentication";
import {
  companyValidator,
  companyValidatorUpdate,
} from "../middlewares/validatorsCompany";

export const routerCompany = Router();
const company = new Company();

routerCompany.get("/", verificaToken, company.getCompany);
routerCompany.get("/:id", verificaToken, company.getCompanyId);
routerCompany.post(
  "/",
  verificaToken,
  isAdmin,
  validate(companyValidator),
  company.postCompany
);
routerCompany.put(
  "/:id",
  verificaToken,
  isAdmin,
  validate(companyValidatorUpdate),
  company.putCompany
);
