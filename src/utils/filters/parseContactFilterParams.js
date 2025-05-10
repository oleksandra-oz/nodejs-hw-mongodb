import { typesList } from '../../constants/contactTypes.js';
import createHttpError from 'http-errors';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return undefined;

  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === 'true') return true;
  if (normalizedValue === 'false') return false;

  return undefined;
};

export const parseContactFilterParams = ({ isFavourite, type }) => {
  const parsedIsFavourite = parseBoolean(isFavourite);

  // Нормалізуємо type до нижнього регістру
  const normalizedType =
    type && typeof type === 'string' ? type.trim().toLowerCase() : undefined;
  const parsedType =
    normalizedType && typesList.includes(normalizedType)
      ? normalizedType
      : undefined;

  // Якщо передано некоректний type, кидаємо помилку
  if (type && !parsedType) {
    throw createHttpError(
      400,
      `Invalid contact type. Must be one of: ${typesList.join(', ')}`,
    );
  }

  return {
    isFavourite: parsedIsFavourite,
    type: parsedType,
  };
};
