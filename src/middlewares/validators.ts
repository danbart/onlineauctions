import { Joi } from 'express-validation';


export const registerValidator = {    
        body: Joi.object({
          name: Joi.string().required(),
          surname: Joi.string().required(),
          email: Joi.string()
            .email()
            .required(),
          password: Joi.string()
            .regex(/[a-zA-Z0-9]{3,30}/)
            .required(),
        }),

}