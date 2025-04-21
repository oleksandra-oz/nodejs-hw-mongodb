import { Schema, model } from 'mongoose';
import { typesList } from '../../constants/contactTypes.js';
import { handleSaveError } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: typesList,
      default: typesList[0],
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSaveError);

const ContactCollection = model('contacts', contactSchema);

export default ContactCollection;
