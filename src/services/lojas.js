const BadRequestError = require("../api/erro/bad-request-error");

class LojaService {
    constructor(LojaModel) {
      this.lojas = LojaModel;
    }
    async get() {
      const lojas = await this.lojas.findAll();
      return lojas;
    }
    async adicionar(loja){
      const lojaExiste = await this.lojas.findOne({
        where: {
          nome: loja.nome
        }
      })
  
      if (lojaExiste) {
        throw new BadRequestError(`A loja ${loja.nome} já está cadastrada no banco de dados!`)
      }

      const lojaCadastrada = await this.lojas.create(loja)
      return lojaCadastrada
    }
  }
  module.exports = LojaService;