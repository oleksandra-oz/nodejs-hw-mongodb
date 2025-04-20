import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  addContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));

contactsRouter.put('/:id', ctrlWrapper(upsertContactController));

export default contactsRouter;
