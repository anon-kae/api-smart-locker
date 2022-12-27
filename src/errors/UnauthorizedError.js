/**
 * UnauthorizedError
 */
class UnauthorizedError extends Error {
  /**
   * Constructor
   * @param message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = UnauthorizedError;
