const express = require("express");
const { restart } = require("nodemon");
const router = express.Router();
const { produtos } = require("../models");
const ProdutoService = require("../services/produtos");
const { body, validationResult } = require("express-validator");
const errorResponse = require("./erro/error-response");

const produtoService = new ProdutoService(produtos);

/**
 * Obter toda a lista de produtos
 */
router.get("/", async (req, res) => {
  /*
        #swagger.tags = ['Produtos']
        #swagger.description = 'Endpoint para obter uma lista de produtos' 
    
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Produtos"},
            description: 'Listagem de produtos.'
        }
        #swagger.responses[400] = {
            description: 'Desculpe, ocorreu um problema.'
        }
    */
  //try {
  const produtos = await produtoService.get();
  res.status(200).json(produtos);
  // } catch (error) {
  //     errorResponse(res, error);
  //   }
});

router.post(
  "/",
  [
    body("nome").notEmpty().withMessage("O atributo nome é obrigatório!"),
    body("preco")
      .notEmpty()
      .isNumeric()
      .withMessage(
        "O atributo preço é obrigatório e deve ser um número decimal!"
      ),
    body("categoria")
      .notEmpty()
      .withMessage("O atributo categoria é obrigatório!"),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    try {
      if (!erros.isEmpty()) {
        errorResponse(res, { message: erros.array() }, 400, "Bad request");
      } else {
        const body = req.body;
        const produto = await produtoService.gravar(body);
        res.status(201).json(produto);
      }
    } catch (e) {
      errorResponse(res, e);
    }
  }
);

module.exports = router;
