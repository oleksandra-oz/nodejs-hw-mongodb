import { typesList } from '../../constants/contactTypes.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === 'true') return true;
  if (normalizedValue === 'false') return false;

  return;
};

export const parseContactFilterParams = ({ isFavourite, contactType }) => {
  const parsedIsFavourite = parseBoolean(isFavourite);
  const parsedType = typesList.includes(contactType) ? contactType : undefined;
  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
};
