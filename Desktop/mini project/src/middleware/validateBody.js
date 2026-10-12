const HttpError = require('../utils/httpError');

module.exports = (allowedFields) => (req, res, next) => {
  const body = req.body;
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return next(new HttpError(400, 'Request body must be a JSON object.'));
  }

  const unexpectedFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length > 0) {
    return next(new HttpError(400, `Unexpected field(s): ${unexpectedFields.join(', ')}.`));
  }
  return next();
};
