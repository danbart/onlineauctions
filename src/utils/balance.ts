import { ModelCredit } from "../models/credit";
import { ModelDebt } from "../models/debt";
import MySql from "../mysql/mysql";

export const balanceDebt = async (
  idAccount: number,
  idUser: number,
  debit: number
) => {
  let credits: ModelCredit[] = [];
  let debts: ModelDebt[] = [];

  let tCredit = 0;
  let tDebt = 0;

  await MySql.executeQuery(
    `SELECT ct.* FROM account ac INNER JOIN credit ct on ac.id_account=ct.id_account where ac.id_user=${idUser} and ac.id_account=${idAccount} and ac.active is not null;`
  ).then((data: any) => (credits = data));

  if (credits.length > 0) {
    for (let credit of credits) {
      tCredit += credit.amount;
    }
  } else return 0;

  await MySql.executeQuery(
    `SELECT dbt.* FROM account ac INNER JOIN debt dbt on ac.id_account=dbt.id_account where ac.id_user=${idUser} and ac.id_account=${idAccount} and ac.active is not null;`
  ).then((data: any) => (debts = data));

  if (debts.length > 0) {
    for (let debt of debts) {
      tDebt += debt.amount;
    }
  }

  tDebt += debit;

  return tCredit - tDebt;
};

export const balance = async (idAccount: number, idUser: number) => {
  let credits: ModelCredit[] = [];
  let debts: ModelDebt[] = [];

  let tCredit = 0;
  let tDebt = 0;

  await MySql.executeQuery(
    `SELECT ct.* FROM account ac INNER JOIN credit ct on ac.id_account=ct.id_account where ac.id_user=${idUser} and ac.id_account=${idAccount} and ac.active is not null;`
  ).then((data: any) => (credits = data));

  if (credits.length > 0) {
    for (let credit of credits) {
      tCredit += credit.amount;
    }
  }

  await MySql.executeQuery(
    `SELECT dbt.* FROM account ac INNER JOIN debt dbt on ac.id_account=dbt.id_account where ac.id_user=${idUser} and ac.id_account=${idAccount} and ac.active is not null;`
  ).then((data: any) => (debts = data));

  if (debts.length > 0) {
    for (let debt of debts) {
      tDebt += debt.amount;
    }
  }

  return [tCredit, tDebt];
};
