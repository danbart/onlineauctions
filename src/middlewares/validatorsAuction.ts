import { Joi } from "express-validation";

export const auctionValidator = {
  body: Joi.object({
    initial_amount: Joi.number().min(1).required(),
    description: Joi.string().required(),
  }),
};

export const auctionValidatorUpdate = {
  body: Joi.object({
    increased_amount: Joi.number().min(1).required(),
  }),
};

export const auctionedValidator = {
  body: Joi.object({
    amount: Joi.number().min(1).required(),
    description: Joi.string().required(),
  }),
};
