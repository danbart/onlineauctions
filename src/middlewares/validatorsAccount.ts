import { Joi } from "express-validation";

export const cardValidator = {
  body: Joi.object({
    card_number: Joi.string().creditCard().required(),
    expiration_date: Joi.string()
      .regex(/(0[1-9]|1[0-2])\/?([0-9]{4})/)
      .required(),
    cvc_code: Joi.number().min(1).max(999).required(),
  }),
};

export const creditValidator = {
  body: Joi.object({
    amount: Joi.number().min(1).required(),
    reason: Joi.string().max(256).required(),
    paid_type: Joi.string().required(),
  }),
};

export const debtValidator = {
  body: Joi.object({
    amount: Joi.number().min(1).required(),
    reason: Joi.string().max(256).required(),
  }),
};
