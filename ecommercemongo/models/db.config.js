// using sequelize with MySQL
// create a connection to the database using environment variables for configuration
import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

// test the database connection
try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
}

// add models here  
import ProductModel from "./products.model.js";
const Product = ProductModel(sequelize, DataTypes);

import CartModel from "./carts.model.js";
const Cart = CartModel(sequelize, DataTypes);

import CartItemModel from "./cart_items.model.js";
const CartItem = CartItemModel(sequelize, DataTypes);

// add relationships here 
// N:M relationship between Product and Cart through a join table CartProducts
// add RESTRICT on delete to prevent deleting products that are in carts
// , and cascading delete for cart items when a cart is deleted
Product.belongsToMany(Cart,{through: CartItem, onDelete: "RESTRICT", foreignKey: "itemId"});
Cart.belongsToMany(Product, { through: CartItem, onDelete: "CASCADE" });


// Sync the models with the database
try {
    await sequelize.sync({ alter: true }); // use { force: true } to drop and recreate tables on every sync (use with caution in production)
    console.log("All models were synchronized successfully.");
} catch (error) {
    console.error("Error synchronizing models:", error);
    process.exit(1);
}   

// export the models for use in other modules
export { Product, Cart, CartItem };
