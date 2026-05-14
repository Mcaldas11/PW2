// set up a mongoose connection
import mongoose from "mongoose";

try {
    const uri =  'mongodb://127.0.0.1:27017/ecommerce'
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
}

// import the models
import ProductModel from "./products.model.js";
const Product = ProductModel(mongoose);

import CartModel from "./carts.model.js";
const Cart = CartModel(mongoose);

import OrderModel from "./orders.model.js";
const Order = OrderModel(mongoose);

// export the models for use in other modules
export { Product, Cart, Order };
