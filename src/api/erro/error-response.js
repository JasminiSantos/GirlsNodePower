const errorResponse = (res, error, statusCode, mensagem) => {
  statusCode = statusCode ? statusCode : 500
  statusCode = error.statusCode ? error.statusCode : statusCode

  mensagem = mensagem ? mensagem : 'Erro no servidor'
  mensagem = error.mensagem ? error.mensagem : mensagem

  const resultado = {
    mensagem: mensagem,
    mensagemErro: error.message
  }

  res.status(statusCode).json(resultado)
}

module.exports = errorResponse