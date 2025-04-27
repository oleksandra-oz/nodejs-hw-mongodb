import { typesList } from '../../constants/contactTypes.js';
import createHttpError from 'http-errors';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === 'true') return true;
  if (normalizedValue === 'false') return false;

  return;
};

export const parseContactFilterParams = ({ isFavourite, type }) => {
  const parsedIsFavourite = parseBoolean(isFavourite);
  const parsedType = typesList.includes(type) ? type : undefined;

  if (type && !parsedType) {
    throw createHttpError(
      400,
      `Invalid contact type. Must be one of: ${typesList.join(', ')}`,
    );
  }

  if (isFavourite && parsedIsFavourite === undefined) {
    throw createHttpError(
      400,
      'Invalid isFavourite value. Must be "true" or "false"',
    );
  }
  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
};
