
const clientes = (sequelize, DataTypes) => {
  const Clientes = sequelize.define("Clientes",{
      nome: {
        type: DataTypes.STRING,
        //unique:true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefone: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
      }
    },
    {
      tableName: 'clientes',
    }
  );

  return Clientes
}

module.exports = clientes
