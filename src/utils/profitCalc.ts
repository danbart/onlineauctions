import { MINIMUM_PROFIT_DISCOUNT, TAX } from "../global/environment";
import { ModelCompany } from "../models/company";
import MySql from "../mysql/mysql";

export const profitCalc = async (idCompany: number, amount: number) => {
  let companies: ModelCompany[] = [];
  let mount = 0;
  let taxes = 0;
  let profit = 0;

  await MySql.executeQuery(
    `SELECT * FROM company where id_company=${idCompany} limit 1;`
  ).then((data: any) => (companies = data));

  if (companies.length === 0) {
    return [];
  }

  if (amount <= MINIMUM_PROFIT_DISCOUNT) {
    mount = (amount * companies[0].maximum_profit) / 100;
    taxes = (amount * TAX) / 100;
    profit = companies[0].maximum_profit;

    amount -= mount;
    amount -= taxes;

    return [mount, taxes, amount, profit];
  } else {
    mount = (amount * companies[0].minimum_profit) / 100;
    taxes = (amount * TAX) / 100;
    profit = companies[0].minimum_profit;

    amount -= mount;
    amount -= taxes;

    return [mount, taxes, amount, profit];
  }
};
