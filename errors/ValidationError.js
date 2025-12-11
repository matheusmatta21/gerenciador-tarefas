class ValidationError extends Error {
  constructor(message = "Erro de validação", details = null) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
    this.details = details;
    this.message = message;
  }
}

module.exports = ValidationError;
