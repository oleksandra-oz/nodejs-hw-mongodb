import * as fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
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
import { getEnvVar } from '../utils/getEnvVar.js';

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
  const userId = req.user._id;
  console.log('GET contact query:', { contactId, userId }); // Дебагування
  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }
  if (!userId) {
    throw createHttpError(401, 'User not authenticated');
  }

  const data = await getContactById(contactId, userId);

  if (!data) {
    console.log('Contact not found for:', { contactId, userId }); // Дебагування
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data,
  });
};

export const addContactController = async (req, res, next) => {
  try {
    console.log('req.file:', req.file); // Дебагування
    console.log('req.body:', req.body); // Дебагування
    let photo = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      if (!result?.secure_url) {
        throw createHttpError(500, 'Failed to upload photo to Cloudinary');
      }
      photo = result.secure_url;
      await fs
        .unlink(req.file.path)
        .catch((err) => console.error('Failed to delete temp file:', err));
    }
    const { _id: userId } = req.user;
    const payload = {
      ...req.body,
      userId,
      photo,
    };
    console.log('Add contact payload:', payload); // Дебагування
    const data = await addContact(payload);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data,
    });
  } catch (error) {
    next(error);
  }
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

export const patchContactController = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('PATCH contact ID:', id); // Дебагування
    console.log('req.file:', req.file); // Дебагування
    console.log('req.body:', req.body); // Дебагування
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, 'Invalid contact ID');
    }
    if (!req.user?._id) {
      throw createHttpError(401, 'User not authenticated');
    }
    if (!req.body && !req.file) {
      throw createHttpError(400, 'Request body or file is required');
    }
    let photo = undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      if (!result?.secure_url) {
        throw createHttpError(500, 'Failed to upload photo to Cloudinary');
      }
      photo = result.secure_url;
      await fs
        .unlink(req.file.path)
        .catch((err) => console.error('Failed to delete temp file:', err));
    }

    const payload = {
      ...req.body,
      userId: req.user._id,
      ...(photo !== undefined && { photo }), // Додаємо photo, якщо воно є
    };
    console.log('Payload for updateContact:', payload); // Дебагування
    const result = await updateContact(id, payload);
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  console.log('DELETE contact query:', { id, userId }); // Дебагування
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, 'Invalid contact ID');
  }
  if (!userId) {
    throw createHttpError(401, 'User not authenticated');
  }

  const data = await deleteContactById(id, userId);
  if (!data) {
    console.log('Contact not found for:', { id, userId }); // Дебагування
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
