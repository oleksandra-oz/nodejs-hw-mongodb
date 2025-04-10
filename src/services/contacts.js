import ContactCollection from "../db/models/Contact.js";

export const getContacts = async() => ContactCollection.find();

export const getContactById = async (id) => ContactCollection.findOne({ _id: id });