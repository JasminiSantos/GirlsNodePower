const express = require("express");
const router = express.Router();
const {
  clientes,
  compras,
  itensCompra,
  produtos,
  lojas,
} = require("../models");
const ClientesService = require("../services/clientes");
const CompraService = require("../services/compra");
const { body, param, validationResult } = require("express-validator");
const errorResponse = require("./erro/error-response");

const clientesService = new ClientesService(clientes);
const compraService = new CompraService(
  compras,
  clientes,
  produtos,
  itensCompra,
  lojas
);
console.log(clientesService);

router.get("/", async (req, res) => {
  const clientes = await clientesService.get();
  console.log(clientes);

  res.status(200).json(clientes);
});

/**
 * Cadastra um novo cliente
 */
router.post(
  "/",
  [
    body("nome").notEmpty().withMessage("O atributo nome é obrigatório!"),
    body("endereco")
      .notEmpty()
      .withMessage("O atributo endereco é obrigatório!"),
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("O atributo email é obrigatório!"),
    body("telefone")
      .notEmpty()
      .withMessage("O atributo telefone é obrigatório!"),
  ],
  async (req, res) => {
    /*
    #swagger.tags = ['Clientes']
    #swagger.description = 'Endpoint para cadastrar um cliente'
    #swagger.parameters['NovoCliente] = {
      in: 'body',
      description: 'Informações do cliente',
      required: true,
      type: 'object',
      schema: { $ref: '#/definitions/NovoCliente'}
    }
    #swager.responses[201] = {
      description: 'Cliente cadastrado com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Nome e telefone são obrigatórios'
    }
  */
    const { nome, email, endereco, telefone } = req.body;
    const erros = validationResult(req);

    try {
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const resposta = await clientesService.adicionar({
          nome,
          email,
          endereco,
          telefone,
        });
        res.status(201).json(resposta);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);
/*
Listar compras do cliente
*/
router.get(
  "/:id/compras",
  [
    param("id")
      .isNumeric()
      .withMessage("O parametro id deve ser um número inteiro!"),
  ],
  async (req, res) => {
    /*
        #swagger.tags = ['Clientes']
        #swagger.description = 'Endpoint para listar compras do cliente' 
    
          #swagger.parameters['id'] = { description: 'ID do cliente.' }
    
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Clientes"},
            description: 'Listagem de compras do cliente.'
        }
        #swagger.responses[400] = {
            description: 'Desculpe, ocorreu um problema.'
        }
    */

    const erros = validationResult(req);

    try {
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const clienteId = req.params.id;
        const resposta = await compraService.listarCompras(clienteId);
        res.status(200).json(resposta);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);

router.post(
  "/:id/compras/lojas/:idloja",
  [
    param("id")
      .isNumeric()
      .withMessage("O parametro id deve ser um número inteiro!"),
    param("idloja")
      .isNumeric()
      .withMessage("O parametro idloja deve ser um número inteiro!"),
    body("produtoId")
      .notEmpty()
      .isNumeric()
      .withMessage(
        "O atributo produtoId é obrigatório e deve ser um número inteiro!"
      ),
  ],
  async (req, res) => {
    /*
    #swagger.tags = ['Compras']
    #swagger.description = 'Endpoint para adicionar produto na compra de um cliente'
    #swagger.parameters['AdicionarProduto] = {
      in: 'body',
      description: 'Adicionar Produto na compra de um cliente',
      required: true,
      type: 'object',
      schema: { $ref: '#/definitions/AdicionarProduto'}
    }
    #swagger.parameters['id'] = { description: 'ID do cliente.' }
    #swagger.parameters['idloja'] = { description: 'ID da loja.' }
    #swager.responses[200] = {
      description: 'Produto adicionado!!'
    }
    #swagger.responses[400] = {
      description: 'Esta compra já possui uma unidade do produto. Só é permitido 1 por compra'
    }

  */

    try {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const body = req.body;
        const clienteId = req.params.id;
        const lojaId = req.params.idloja;
        const resultado = await compraService.adicionarItem(
          body,
          clienteId,
          lojaId
        );
        res.json(resultado);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);

/*
Remove produto da compra do cliente
*/
router.delete(
  "/:id/compras/:idcompra/produtos/:produtoid",
  [
    param("id")
      .isNumeric()
      .withMessage("O parametro id deve ser um número inteiro!"),
    param("idcompra")
      .isNumeric()
      .withMessage("O parametro idcompra deve ser um número inteiro!"),
    param("produtoid")
      .isNumeric()
      .withMessage("O parametro produtoid deve ser um número inteiro!"),
  ],
  async (req, res) => {
    /*
    #swagger.tags = ['Compras']
    #swagger.description = 'Endpoint para remover produto da compra do cliente'
    
    #swager.responses[200] = {
      description: 'Produto removido!!'
    }
    #swagger.parameters['id'] = { description: 'ID do cliente.' }
    #swagger.parameters['idcompra'] = { description: 'ID da compra.' }
    #swagger.parameters['produtoid'] = { description: 'ID do produto a ser removido.' }
    #swagger.responses[400] = {
      description: 'Só é possível retirar um item de uma compra em andamento. Status atual: RETIRADO'
    }
  */

    try {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const {
          id: clienteId,
          idcompra: compraId,
          produtoid: produtoId,
        } = req.params;
        const resposta = await compraService.removerItem(
          clienteId,
          compraId,
          produtoId
        );
        res.status(200).json(resposta);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);

/*
Finalizar compra
*/
router.patch(
  "/:id/compras/:idcompra/finalizar",
  [
    param("id")
      .isNumeric()
      .withMessage("O parametro id deve ser um número inteiro!"),
    param("idcompra")
      .isNumeric()
      .withMessage("O parametro idcompra deve ser um número inteiro!"),
  ],
  async (req, res) => {
    /*
    #swagger.tags = ['Compras']
    #swagger.description = 'Endpoint para finalizar compras do cliente'
    #swagger.parameters['id'] = { description: 'ID do cliente.' }
    #swagger.parameters['idcompra'] = { description: 'ID da compra.' }
    #swager.responses[200] = {
      description: 'Compra finalizada!!'
    }
    #swagger.responses[400] = {
      description: 'Não foi possivel finalizar a sua compra'
    }
  */
    try {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const { id: clienteId, idcompra: compraId } = req.params;
        const resposta = await compraService.finalizar(clienteId, compraId);
        res.status(200).json(resposta);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);

/*
Retirar compra na loja
*/
router.patch(
  "/:id/compras/:idcompra/retirar",
  [
    param("id")
      .isNumeric()
      .withMessage("O parametro id deve ser um número inteiro!"),
    param("idcompra")
      .isNumeric()
      .withMessage("O parametro idcompra deve ser um número inteiro!"),
  ],
  async (req, res) => {
    /*
    #swagger.tags = ['Compras']
    #swagger.description = 'Endpoint para retirar compras na loja'
    #swagger.parameters['id'] = { description: 'ID do cliente.' }
    #swagger.parameters['idcompra'] = { description: 'ID da compra.' }
    #swager.responses[200] = {
      description: 'Compra retirada!!'
    }
    #swagger.responses[400] = {
      description: 'Não é possivel retirar sua compra'
    }
  */
    try {
      const erros = validationResult(req);
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const { id: clienteId, idcompra: compraId } = req.params;
        const resposta = await compraService.retirar(clienteId, compraId);
        res.status(200).json(resposta);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);

module.exports = router;
