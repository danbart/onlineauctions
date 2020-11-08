import { Joi } from "express-validation";

export const auctionValidator = {
  body: Joi.object({
    auction_date: Joi.string().required(),
    initial_amount: Joi.number().min(1).required(),
    description: Joi.string().required(),
  }),
};

export const auctionValidatorUpdate = {
  body: Joi.object({
    increased_amount: Joi.number().min(1).required(),
  }),
};
