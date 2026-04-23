import { Cart, Product } from "../models/db.config.js";

import { genericError, conflictError, notFoundError } from "../utils/error.utils.js";

export const createCart = async (req, res, next) => {
    try {
        const newCart = await Cart.create();
        res.status(201).json(newCart);
    } catch (error) {
        next(genericError("Error creating cart"));
    }
};

export const addItem = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { productId, quantity } = req.body;

        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            return next(notFoundError("cart", cartId));
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return next(notFoundError("product", productId));
        }

        // check if the cart have already the product
        const hasItem = await cart.hasProduct(product);
        if (hasItem) {
            return next(conflictError());
        }

        if (product.stock < quantity) {
            return next(conflictError({
                product : `Not enough stock for product with ID ${productId}`
            }));
        }

        const cartItems = await cart.addProducts(product,
            { through: { quantity }});

        product.stock -= quantity;
        await product.save();

        res.status(201).json(cartItems);

        
    } catch (error) {
        console.error(error);
        next(genericError("Error adding item to cart"));
    }
};