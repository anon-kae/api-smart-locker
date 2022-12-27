const logger = require('./logger')('ErrorHandler');
const errors = require('../errors');
const config = require('../configs');

const { PermissionError, ResourceNotFoundError, ValidationError, UnauthorizedError } = errors;

/**
 * Error Handler
 * @param err
 * @param req
 * @param res
 * @param next
 */
async function errorHandler(err, req, res, next) {
  try {
    const message =(typeof err === 'string') ? err : err.message;

    if (err instanceof PermissionError) {
      return res.status(403).send({ error: { message } });
    } else if (err instanceof UnauthorizedError) {
      return res.status(401).send({ error: { message } });
    } else if (err instanceof ResourceNotFoundError) {
      return res.status(404).send({ error: { message } });
    } else if (err instanceof ValidationError) {
      return res.status(400).send({ error: { message } });
    } else if (config.env === 'production') {
      logger.error(message, { error: err instanceof Error ? err.stack : err });
      return res.status(500).send({ error: { message: 'Oops! something went wrong.' } });
    } else {
      logger.error(err, { error: err instanceof Error ? err.stack : err });
      return res.status(500).send({ error: { message } });
    }
  } catch (err) {
    logger.error(`Failed to handle error: ${err.message}`, { stack: err.stack });
    return res.status(500).send({ error: { message: 'Oops! something went wrong.' } });
  }
}

module.exports = errorHandler;
