import { Joi } from "express-validation";

const year = new Date();

export const vehicleValidator = {
  body: Joi.object({
    model: Joi.number()
      .integer()
      .min(year.getFullYear() - 50)
      .max(year.getFullYear())
      .required(),
    mileage: Joi.string(),
    colour: Joi.string().required(),
    transmission: Joi.string().required(),
    cylinders: Joi.string(),
    fuel: Joi.string(),
    revolutions: Joi.number().min(0),
    motor: Joi.number().min(0),
    vin: Joi.string().required(),
    keys: Joi.bool(),
    description: Joi.string(),
    type: Joi.number().integer().min(1).required(),
    state: Joi.number().integer().min(1).required(),
    body_style: Joi.number().integer().min(1).required(),
  }),
};
