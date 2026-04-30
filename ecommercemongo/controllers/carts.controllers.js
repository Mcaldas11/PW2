import mongoose from "mongoose";

import { Cart, Product, Order } from "../models/db.config.js";
import * as errorUtils from "../utils/error.utils.js";

export const create = async (req, res, next) => {
  try {
    const cart = await Cart.create({});
    const cartResponse = {
      ...cart.toJSON(),
      links: {
        addItems: { href: `/carts/${cart.id}/items`, method: "POST" },
      },
    };
    res.status(201).json(cartResponse);
  } catch (error) {
    next(errorUtils.genericError("Error creating cart"));
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    const cart_item_errors = [];
    if (!productId) cart_item_errors.push("Field productId is required");
    if (quantity === undefined)
      cart_item_errors.push("Field quantity is required");
    if (!Number.isInteger(quantity))
      cart_item_errors.push("Quantity must be an integer");
    if (quantity <= 0) cart_item_errors.push("Quantity must be greater than 0");
    if (cart_item_errors.length > 0) {
      return next(errorUtils.validationError({ cart_item: cart_item_errors }));
    }

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return next(errorUtils.notFoundError("cart", cartId));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(errorUtils.notFoundError("product", productId));
    }

    const cart = await Cart.findById(cartId);
    if (!cart) return next(errorUtils.notFoundError("cart", cartId));

    const product = await Product.findById(productId);
    if (!product) return next(errorUtils.notFoundError("product", productId));

    if (product.stock < quantity) {
      return next(
        errorUtils.conflictError({
          stock: `Not enough stock for product ${productId}.`,
        }),
      );
    }

    const hasProductInCart = cart.items.some(
      (item) => item.productId.toString() === productId,
    );
    if (hasProductInCart) {
      return next(
        errorUtils.conflictError(
          `Product ${productId} is already in cart ${cartId}.`,
        ),
      );
    }

    cart.items.push({ productId, quantity });
    await cart.save();

    product.stock -= quantity;
    await product.save();

    const updatedCartDocument =
      await Cart.findById(cartId).populate("items.productId");
    const updatedCart = {
      ...updatedCartDocument.toJSON(),
      items: updatedCartDocument.items.map((item) => ({
        id: item.productId.id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        links: {
          product: `/products/${item.productId.id}`,
          updateQuantity: `/carts/${cartId}/items/${item.productId.id}`,
          removeItem: `/carts/${cartId}/items/${item.productId.id}`,
        },
      })),
    };

    res.status(200).json(updatedCart);
  } catch (error) {
    next(errorUtils.genericError("Error adding item to cart"));
  }
};

export const checkout = async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId).populate("items.productId");
    if (!cart) return next(errorUtils.notFoundError("cart", cartId));

    // check if cart is empty and return 400 if it is
    if (cart.items.length === 0) {
      return next(errorUtils.validationError({ cart: "Cart is empty" }));
    }

    const outOfStockProducts = cart.items.filter(
      (item) => item.productId.stock < item.quantity,
    );
    if (outOfStockProducts.length > 0) {
      return next(
        errorUtils.conflictError({
          stock: `Not enough stock for products: ${outOfStockProducts.map((item) => item.productId.id).join(", ")}.`,
        }),
      );
    }

    // if all products have enough stock, we proceed to checkout
    // we update the stock of each product and save the cart with an empty items array
    for (const item of cart.items) {
      const product = await Product.findById(item.productId.id);
      product.stock -= item.quantity;
      await product.save();
    }
    // build order items and total price
    const orderItems = cart.items.map((item) => ({
      productId: item.productId.id || item.productId._id,
      name: item.productId.name,
      priceAtPurchase: item.productId.price,
      quantity: item.quantity,
    }));

    const totalPrice = orderItems.reduce(
      (sum, it) => sum + it.priceAtPurchase * it.quantity,
      0,
    );

    // create order
    const newOrder = await Order.create({ items: orderItems, totalPrice });

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
        orderId : orderItems._id,
        links: {
            order: `/orders/${newOrder._id}`,
        }
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(errorUtils.mongooseValidationError(error.errors));
    }
    next(errorUtils.genericError("Error during checkout"));

    }
};
