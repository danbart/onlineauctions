import { Joi } from "express-validation";

export const userValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{6,30}/)
      .required(),
    avatar: Joi.string(),
    addres: Joi.string(),
    phone: Joi.string().regex(/[2-9]{8,30}/),
    web_site: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string(),
  }),
};

export const userValidatorUpdate = {
  body: Joi.object({
    name: Joi.string(),
    last_name: Joi.string(),
    avatar: Joi.string(),
    addres: Joi.string(),
    phone: Joi.string().regex(/[2-9]{8,30}/),
    web_site: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string(),
  }),
};

export const userValidatorLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const userUpdatePasswordValidator = {
  body: Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string()
      .regex(/[a-zA-Z0-9]{6,30}/)
      .required(),
  }),
};

export const userRolValidator = {
  body: Joi.object({
    role: Joi.string().required(),
  }),
};
