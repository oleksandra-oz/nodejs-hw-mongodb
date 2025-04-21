import ContactCollection from '../db/models/Contacts.js';

export const getContacts = () => ContactCollection.find();
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
