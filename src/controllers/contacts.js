import {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from './../utils/parseSortParams.js';
import { contactSortFields } from '../db/models/Contacts.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';
import mongoose from 'mongoose';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filter = parseContactFilterParams(req.query);
  filter.userId = req.user._id;
  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const {_id:userId}= req.user;
  const data = await addContact({...req.body, userId});
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, 'Invalid contact ID');
  }
  if (!req.user?._id) {
    throw createHttpError(401, 'User not authenticated');
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body is empty');
  }

  const payload = { ...req.body, userId: req.user._id };
  const { data, isNew } = await updateContact(id, payload, { upsert: true });
  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'Successfully updated a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, 'Invalid contact ID');
  }
  if (!req.user?._id) {
    throw createHttpError(401, 'User not authenticated');
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body is empty');
  }

  const payload = { ...req.body, userId: req.user._id };
  const result = await updateContact(id, payload);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const data = await deleteContactById(id);
  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
