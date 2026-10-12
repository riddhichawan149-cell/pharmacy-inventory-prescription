const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');

module.exports = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ error: 'A record with one of these unique values already exists.' });
  }
  if (error instanceof ForeignKeyConstraintError) {
    return res.status(409).json({ error: 'This record is referenced by another record and cannot be removed.' });
  }
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map((item) => ({ field: item.path, message: item.message }))
    });
  }

  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  }
  return res.status(status).json({
    error: status >= 500 ? 'Internal server error' : error.message
  });
};
