import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { id, contactId } = req.params;
  const paramId = id || contactId;

  if (!paramId || !isValidObjectId(paramId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }
  next();
};
