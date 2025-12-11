const { validationResult } = require('express-validator');
const ValidationError = require('../errors/ValidationError');

function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) return next();

      const errorMessages = errors.array().map(err => err.msg).join(', ');
      
      return next(
        new ValidationError(errorMessages, errors.mapped())
      );
    },
  ];
}

module.exports = { validate };
