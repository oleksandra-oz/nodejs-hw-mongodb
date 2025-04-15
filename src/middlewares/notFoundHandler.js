import createHttpError from 'http-errors';

export const notFoundHandler = (req, res) => {
    throw createHttpError(404, `${req.url} not found`);
};