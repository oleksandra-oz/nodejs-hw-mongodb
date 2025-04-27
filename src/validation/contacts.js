import Joi from 'joi';
import { typesList } from '../constants/contactTypes.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'You forgot to add a name :)',
    'string.base': 'Name must be a sting type!',
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typesList)
    .required(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typesList),
});
