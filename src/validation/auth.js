import Joi from 'joi';
import { emailRegex } from '../constants/auth.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const requestResetPasswordSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});