const ErrorService = require("./error");

class NotFoundError extends ErrorService {
  constructor(mensagem) {
    super(mensagem, 404, 'Not Found')
  }
}

module.exports = NotFoundError
