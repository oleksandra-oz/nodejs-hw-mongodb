import ContactCollection from '../db/models/Contacts.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = ContactCollection.find();

  if (filter.userId) {
    contactQuery.where('userId').equals(filter.userId);
  }

  if (filter.type) {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const totalItems = await contactQuery.clone().countDocuments();
  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ page, perPage, totalItems });
  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};
export const getContactById = (contactId) =>
  ContactCollection.findOne({ _id: contactId });
export const addContact = (payload) => ContactCollection.create(payload);
export const updateContact = async (_id, payload, options = {}) => {
  const { upsert = false } = options;
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    runValidators: true,
    upsert,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = async (_id) =>
  await ContactCollection.findOneAndDelete({ _id });
