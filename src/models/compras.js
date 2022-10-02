const compras=(sequelize,Datatypes)=>{
    const Compras=sequelize.define(
        "Compras",
        {
            id_cliente:{
                type:Datatypes.INTEGER,
                allowNull:false
            },
            status:{
                type:Datatypes.STRING,
                allowNull:false
            },
            id_loja: {
                type: Datatypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName:"compras"
        }
    )
    return Compras
}

module.exports=compras