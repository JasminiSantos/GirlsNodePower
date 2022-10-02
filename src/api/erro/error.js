class ErrorService extends Error {
    constructor(message, statusCode, mensagem) {
        super(message)
        this.statusCode = statusCode
        this.mensagem = mensagem
    }
}

module.exports = ErrorService