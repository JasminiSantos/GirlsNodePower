const ErrorService = require("./error");

class BadRequestError extends ErrorService {
  constructor(mensagem) {
    super(mensagem, 400, 'Bad Request')
  }
}

module.exports = BadRequestError
