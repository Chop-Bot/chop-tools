class MiddlewareError extends Error {
  constructor(errorMessage, call) {
    super(errorMessage);
    this.call = call;
  }
}

module.exports = MiddlewareError;
