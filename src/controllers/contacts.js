import { getContacts, getContactById } from '../services/contacts.js';

export const getContactsController = async (req, res) => {
    const data = await getContacts();
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    try {
        const data = await getContactById(contactId);

        if (!data) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found',
            });
        }

        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}`,
            data,
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
        
};