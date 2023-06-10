class CustomError extends Error {
  constructor({ message, hint, statusCode = 500, info = null }) {
    super(message);
    this.hint = hint;
    this.statusCode = statusCode;
    this.info = info;
  }
}

module.exports = { CustomError };
