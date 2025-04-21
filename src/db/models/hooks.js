export const handleSaveError = (err, doc, next) => {
  err.status = 400;
  next();
};
