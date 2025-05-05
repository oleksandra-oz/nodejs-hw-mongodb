export const handleSaveError = (err, doc, next) => {
  const { code, name } = err;
  err.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
