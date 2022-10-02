const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/swagger_output.json";
const endpointFiles = ["./src/app.js"];

/**
 * documentando
 */
const doc = {
  info: {
    version: "1.0.0",
    title: "API Omni Channel -  GirlsNodePower",
    description:
      "Serviço HTTP resolvendo funcionalidade Omni CHannel do cliente",
  },
  host: "localhost:5000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Lojas",
      description: "Endpoints relacionados aos recursos de loja.",
    },
    {
      name: "Produtos",
      description: "Endpoints relacionados aos recusos de produto",
    },
    {
      name: "Clientes",
      description: "Endpoints relacionados aos recusos de cliente",
    },
    {
      name: "Compras",
      description: "Endpoints relacionados aos recusos de compras do cliente",
    },
  ],
  definitions: {
    Lojas: [
      {
        id: 2,
        nome: "Loja Osasco",
        endereco: "Centro ",
        createdAt: "2021-09-01T01:03:52.018Z",
        updatedAt: "2021-09-01T01:03:52.018Z",
      },
      {
        id: 2,
        nome: "Loja Osasco",
        endereco: "Centro ",
        createdAt: "2021-09-01T01:03:52.018Z",
        updatedAt: "2021-09-01T01:03:52.018Z",
      },
    ],
    Produtos: [
      {
        id: 1,
        nome: "Celular",
        preco: 1000,
        categoria: "telefonia",
        createdAt: "2021-09-01T01:03:52.018Z",
        updatedAt: "2021-09-01T01:03:52.018Z",
      },
    ],

    NovoCliente: {
      $nome: "Luiza",
      $email: "user@dominio.com",
      $endereco: "Rua xxx,10 - Franca/SP",
      $telefone: "(16)987654321",
    },
    AdicionarProduto: {
      $produtoId: 2,
    },
  },
};

swaggerAutogen(outputFile, endpointFiles, doc);
