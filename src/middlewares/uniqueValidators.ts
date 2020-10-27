import { Joi } from "express-validation";

export const stateValidator = {
  body: Joi.object({
    state: Joi.string().required(),
  }),
};

export const bodyStyleValidator = {
  body: Joi.object({
    style: Joi.string().required(),
  }),
};
