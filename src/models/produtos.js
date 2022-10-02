const produtos = (sequelize, DataTypes) => {
  const Produtos = sequelize.define(
    "Produtos",
    {
      nome: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      preco: {
        type: DataTypes.DOUBLE,
      },
      categoria: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "produtos",
    }
  );
  return Produtos;
};

module.exports = produtos;
