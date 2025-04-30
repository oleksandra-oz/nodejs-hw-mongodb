import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authRegisterSchema, authLoginSchema } from '../validation/auth.js';
import { validateBody } from './../utils/validateBody.js';
import { registerController, loginController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

export default authRouter;
