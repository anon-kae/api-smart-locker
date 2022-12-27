const logger = require('../utils/logger')('ValidateSchema');
const { ValidationError } = require('../errors');

/**
 * Validate Schema
 */
exports.validateSchema = (schema, properties = 'body') => async (req, res, next) => {
  try {
    const { error } = schema.validate(req[properties], { abortEarly: false });

    const errorStrings = error?.details.map(({ message }) => message).join(', ').replace(/["]/g, '');

    if (errorStrings) {
      throw new ValidationError(errorStrings.split(', '));
    }

    next();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

