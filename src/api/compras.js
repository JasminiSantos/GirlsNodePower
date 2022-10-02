const express = require("express");
const router = express.Router();
const { compras } = require("../models");
const CompraService = require("../services/compras");
const { body, check, validationResult } = require("express-validator");

const produtoService = new ProdutoService(produto);

router.get("/compras", async (req, res) => {
  const compras = await CompraService.get();
  res.status(200).json(compras);
});

module.exports = router;