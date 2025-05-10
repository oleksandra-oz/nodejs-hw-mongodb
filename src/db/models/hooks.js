export const handleSaveError = (err, doc, next) => {
  err.status = 400;
  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
};
