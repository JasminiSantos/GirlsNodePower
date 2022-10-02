const BadRequestError = require("../api/erro/bad-request-error");

class ClientesService{
  constructor(ClienteModel){
      this.clienteModel = ClienteModel

  }

  async get(){
      const clientes=await this.clienteModel.findAll()
      return clientes
  }
  
  async adicionar(cliente){
    const clienteCadastrado = await this.clienteModel.findOne({
      where: {
        nome: cliente.nome
      }
    })
  
    if (clienteCadastrado) {
    throw new BadRequestError(`Já existe um cadastro para o cliente ${cliente.nome}!`)
    }

    cliente = await this.clienteModel.create(cliente)
    return cliente
  }
}

module.exports=ClientesService