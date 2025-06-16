import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authRegisterSchema, authLoginSchema, requestResetPasswordSchema, resetPasswordSchema } from '../validation/auth.js';
import { validateBody } from './../utils/validateBody.js';
import { registerController, loginController, refreshController, logoutController, requestResetPasswordController, resetPasswordController } from '../controllers/auth.js';

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

authRouter.post(
  '/refresh',
  ctrlWrapper(refreshController),
);

authRouter.post(
  '/logout',
  ctrlWrapper(logoutController),
);

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController)
);


authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);


export default authRouter;
