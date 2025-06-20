import path from 'node:path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from '../docs/swagger.json' with { type: 'json' };

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
  app.use('/avatars', express.static(path.resolve('src', 'uploads', 'avatars')));
  // app.use(logger);

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server is running on ${port} port`));
};