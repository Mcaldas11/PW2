import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIAL
    }
);

try {
    await sequelize.authenticate()
    console.log('Server is connected')
} catch(e){
    console.error("Unable to connect", e)
    process.exit(1)
}

import ProductModel from './products.model.js'
const  Product = ProductModel(sequelize, DataTypes) // Sequelize.DataTypes

// try{
//     await sequelize.sync({force: true})
//     console.log("Database Synced")
// } catch(e) {
//     console.error('Error syncing', e)
//     process.exit(1)
// }
export { Product }