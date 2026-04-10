import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const authRouter = Router();

authRouter.post(
  '/register',
  celebrate({
    [Segments.BODY]: registerUserSchema,
  }),
  registerUser,
);

authRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: loginUserSchema,
  }),
  loginUser,
);

authRouter.post(
  '/request-reset-email',
  celebrate({
    [Segments.BODY]: requestResetEmailSchema,
  }),
  requestResetEmail,
);

authRouter.post(
  '/reset-password',
  celebrate({
    [Segments.BODY]: resetPasswordSchema,
  }),
  resetPassword,
);

authRouter.post('/refresh', refreshUserSession);

authRouter.post('/logout', logoutUser);

export default authRouter;
