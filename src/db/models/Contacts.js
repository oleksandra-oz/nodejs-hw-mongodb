import { Schema, model } from 'mongoose';
import { typesList } from '../../constants/contactTypes.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

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
      required: false,
    },
    contactType: {
      type: String,
      enum: typesList,
      default: typesList[0],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    photo: {
      type: String,
      required: false,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactSortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'photo'
];

const ContactCollection = model('contacts', contactSchema);

export default ContactCollection;
