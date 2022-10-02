const itemCompra = (sequelize, DataTypes) => {
  const ItemsCompra = sequelize.define(
    "ItemCompra",
    {
      id_produto: {
        type: DataTypes.INTEGER
      },
      id_cliente: {
        type: DataTypes.INTEGER,
      },
      id_compra: {
        type: DataTypes.INTEGER,
      }
    },
    {
      tableName: "item_compra",
    }
  );
  return ItemsCompra;
};

module.exports = itemCompra;
