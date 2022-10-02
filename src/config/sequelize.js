const config = require('./config')
const Sequelize=require('sequelize')
const configDatabase=require('./database')

const env = config.env
let sequelize

if (env === 'producao') {
    sequelize= new Sequelize(config.database.url, {
        dialect: 'postgres',
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
} else {
    sequelize= new Sequelize(configDatabase)
}

module.exports=sequelize