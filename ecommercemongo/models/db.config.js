// setup mongoose with MOnogoDB
import mongoose from "mongoose";

try {
  const uri = "mongodb://localhost:27017/ecommerce";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // exit the process with failure
}

import ProductModel from "./products.model.js";
const Product = ProductModel(mongoose);

import CartModel from "./carts.model.js";
const Cart = CartModel(mongoose);

import OrderModel from "./orders.model.js";
const Order = OrderModel(mongoose);

// export the models for use in other modules
export { Product, Cart, Order };
