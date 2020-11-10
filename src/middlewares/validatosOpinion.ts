import { Joi } from "express-validation";

export const opinionValidator = {
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(10).required(),
    opinion: Joi.string().required(),
  }),
};

export const opinionValidatorUpdate = {
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(10),
    opinion: Joi.string(),
  }),
};
