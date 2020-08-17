class HttpError extends Error {
  constructor(message, errorCode, body = 0) {
    super(message);
    this.code = errorCode;
    this.body = body;
  }
}

module.exports = HttpError;
