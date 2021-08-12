const httpStatus = require("http-status");
const ExtendableError = require("./extendable-error");

class APIError extends ExtendableError {
  constructor({
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }) {
    super({
      message,
      errors,
      status,
      stack,
      isPublic,
    });
  }
}

module.exports = APIError;
