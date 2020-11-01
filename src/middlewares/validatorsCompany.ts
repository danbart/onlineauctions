import { Joi } from "express-validation";

export const companyValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/[2-9]{8,30}/)
      .required(),
    addres: Joi.string().required(),
    logo: Joi.string(),
    mission: Joi.string(),
    vision: Joi.string(),
    values: Joi.string(),
    maximum_profit: Joi.number().min(0),
    minimum_profit: Joi.number().min(0),
  }),
};

export const companyValidatorUpdate = {
  body: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().regex(/[2-9]{8,30}/),
    addres: Joi.string(),
    logo: Joi.string(),
    mission: Joi.string(),
    vision: Joi.string(),
    values: Joi.string(),
    maximum_profit: Joi.number().min(0),
    minimum_profit: Joi.number().min(0),
  }),
};
