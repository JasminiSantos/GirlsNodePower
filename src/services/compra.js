const CompraStatus = require('../services/compra-status');
const NotFoundError = require('../api/erro/error-not-found');
const BadRequestError = require('../api/erro/bad-request-error');
const ErrorService = require('../api/erro/error');
const { Op } = require('sequelize')

class CompraService {
  constructor(CompraModel, ClienteModel, ProdutoModel, ItensCompraModel, LojasModel) {
    this.compra = CompraModel
    this.cliente = ClienteModel
    this.produto = ProdutoModel
    this.itensCompra = ItensCompraModel
    this.lojas = LojasModel
  }
  async get() {
    const compras = await this.compra.findAll();
    return compras;
  }

  async adicionarItem(body, clienteId, lojaId) {
    clienteId = parseInt(clienteId)
    lojaId = parseInt(lojaId)
    const produtoId = body.produtoId

    const cliente = await this.validarCliente(clienteId)
    const produto = await this.validarProduto(produtoId)

    // verifica se existe uma compra em andamento para o cliente
    let compra = await this.compra.findOne({
      where: {
        id_cliente: clienteId,
        status: CompraStatus.emAndamento
      }
    })

    // se não existir, cria uma nova compra no banco de dados antes de inserir um item
    if (!compra) {
      compra = await this.compra.create({
        id_cliente: clienteId, 
        status: CompraStatus.emAndamento, 
        id_loja: lojaId
      })
    }

    let itemCompra = await this.itensCompra.findAll({
      where: {
        id_produto: produtoId, 
        id_compra: compra.id 
      } 
    })

    if (itemCompra.length > 0) {
      throw new BadRequestError(`Esta compra já possui uma unidade do produto ${produto.nome}. Só é permitido 1 por compra`)
    } else {
      itemCompra = await this.itensCompra.create({
        id_produto: produtoId,
        id_cliente: clienteId,
        id_compra: compra.id
      })
    }

    compra = await this.compra.findOne({ where: { id: compra.id } })
    compra = this.buildComprasWithItens([compra])

    return compra
  }

  async removerItem(clienteId, compraId, produtoId) {
    let compra = await this.compra.findOne({ where: { id: compraId } })

    if (!compra) {
      throw new BadRequestError(`Id de compra inválido!`)
    } else if (compra.status != CompraStatus.emAndamento) {
      throw new BadRequestError(`Só é possível retirar um item de uma compra em andamento. Status atual: ${compra.status}`)
    }

    try {
      await this.itensCompra.destroy({
        where: {
          id_produto: produtoId, 
          id_compra: compraId,
          id_cliente: clienteId,
        }
      })

      compra = await this.compra.findOne({ where: { id: compraId } })
      compra = this.buildComprasWithItens([compra])

      return compra
    } catch (e) {
      throw new ErrorService(e.message, 500, 'Não foi possível excluir o item!')
    }
  }

  async listarCompras(clienteId) {
    const clienteCadastrado = await this.validarCliente(clienteId)
    const cliente = this.buildCliente(clienteCadastrado)
    const comprasCadastradas = await this.compra.findAll({ where: { id_cliente: clienteId } })

    if (comprasCadastradas.length == 0) {
      throw new NotFoundError(`Não existem compras para o cliente ${cliente.nome}`)
    }

    const compras = await this.buildComprasWithItens(comprasCadastradas)
    
    cliente.compras = compras

    return cliente
  }

  async finalizar(clienteId, compraId) {
    let compra = await this.compra.findOne({ where: { id: compraId } })

    if (!compra) {
      throw new NotFoundError('Compra não encontrada!')
    }

    if (compra.status != CompraStatus.emAndamento) {
      throw new BadRequestError(`Não é possível finalizar uma compra com status ${compra.status}`)
    }

    const resultado = await this.compra.update({
      status: CompraStatus.realizada
    }, {
      where: {
        id: compraId
      }
    })

    compra = await this.compra.findOne({ where: { id: compraId } })
    compra = await this.buildComprasWithItens([compra])

    return compra
  }

  async retirar(clienteId, compraId) {
    let compra = await this.compra.findOne({ where: { id: compraId } })

    if (!compra) {
      throw new NotFoundError('Compra não encontrada!')
    }

    if (compra.status != CompraStatus.realizada) {
      throw new BadRequestError(`Não é possível retirar uma compra com status ${compra.status}`)
    }

    const resultado = await this.compra.update({
      status: CompraStatus.retirado
    }, {
      where: {
        id: compraId
      }
    })

    compra = await this.compra.findOne({ where: { id: compraId } })
    compra = await this.buildComprasWithItens([compra])

    return compra
  }

  async validarCliente(clienteId) {
    // busca o cliente pelo id
    const cliente = await this.cliente.findOne({ where: { id: clienteId } })

    // se o cliente não existir, lança uma exceção de NOT FOUND
    if (!cliente) {
      throw new NotFoundError('Cliente inválido!')
    }

    return cliente
  }

  async validarProduto(produtoId) {
    const produto = await this.produto.findOne({ where: { id: produtoId } })

    if (!produto) {
      throw new BadRequestError('Produto inválido!')
    }

    return produto
  }

  buildCliente(clienteCadastrado) {
    return {
      id: clienteCadastrado.id,
      nome: clienteCadastrado.nome
    }
  }

  async buildComprasWithItens(comprasCadastradas) {
    const compras = []

    for (const compraCadastrada of comprasCadastradas) {
      const loja = await this.lojas.findOne({ where: { id: compraCadastrada.id_loja } })
      let compra = {
        id: compraCadastrada.id,
        loja: loja.nome,
        status: compraCadastrada.status
      }

      compra = await this.buildItens(compra)

      compras.push(compra)
    }

    return compras
  }

  async buildItens(compra) {
    const itensCadastrados = await this.itensCompra.findAll({ attributes: ['id_produto'], where: { id_compra: compra.id } })
    const ids = []
    itensCadastrados.forEach(element => {
      ids.push(element.id_produto)
    });

    const produtosCadastrados = await this.produto.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })

    compra.itens = []

    produtosCadastrados.forEach(element => {
      const produto = {
        id: element.id,
        nome: element.nome,
        preco: element.preco,
        categoria: element.categoria
      }

      compra.itens.push(produto)
    })

    return compra
  }
}
module.exports = CompraService;
