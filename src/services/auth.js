import * as fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { randomBytes } from 'node:crypto';
import UserCollection from '../db/models/User.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/Session.js';
import {
  refreshTokenLifeTime,
  accessTokenLifeTime,
} from '../constants/auth.js';

import { sendMail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
// import { resetPassword } from './auth';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8',
);

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = async (query) => {
  console.log('FindSession filter:', query); // Дебагування
  const session = await SessionCollection.findOne(query);
  console.log('Found session:', session); // Дебагування
  return session;
};

export const findUser = (query) => UserCollection.findOne(query);

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
  return newUser;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email }).select('+password');
  if (!user) {
    throw createHttpError(401, 'Email or password are invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password are invalid');
  }

  await SessionCollection.findOneAndDelete({ userId: user._id });

  const session = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await SessionCollection.findOne({
    refreshToken,
    _id: sessionId,
  });
  if (!session) {
    throw createHttpError(401, 'Session is not found');
  }
  if (session.refreshTokenValidUntil < Date.now()) {
    await SessionCollection.findByIdAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token is expired');
  }

  await SessionCollection.findByIdAndDelete({ _id: session._id });

  const newSession = createSession();
  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

export const reqResetPassword = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (user == null) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendMail(
    user.email,
    'Reset password',
    template({ link: `http://localhost:3000/reset-password/?token=${token}` }),
  );
};

export const resetPassword = async(password, token)=>{
try {
  const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
  const user = await UserCollection.findById(decoded.sub);

  if (user == null){
    throw createHttpError(404, 'User not found');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.findByIdAndUpdate(user._id, {password: hashedPassword});
} catch (error) {
  if (error.name == "JsonWebTokenError"){
    throw createHttpError(404, 'User not found!');
  }
  if (error.name == "TokenExpiredError"){
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  throw error;
}
};
