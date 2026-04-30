// import necessary models
import { Cart, Product } from "../models/db.config.js";
// import error utils
import * as errorUtils from "../utils/error.utils.js";

// controller to create a new cart
export const create = async (req, res, next) => {
    try {
        const cart = await Cart.create();
        // add hateoas links to the response
        const cartResponse = {
            ...cart.toJSON(),
            links: {
                addItems: { href: `/carts/${cart.id}/items`, method: "POST" }
            }
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

        // sequelize validations on junction tables are a bit tricky, 
        // so we will do some manual validations
        // 1. validate request: mandatory fields and that quantity is a positive integer
        let cart_item_errors = [];
        if (!productId) cart_item_errors.push("Field productId is required");
        // because quantity is a number (and 0 is a falsy value), 
        // we need to check for undefined instead of just falsy value
        if (quantity === undefined) cart_item_errors.push("Field quantity is required");
        if (!Number.isInteger(quantity))
            cart_item_errors.push("Quantity must be an integer");
        if (quantity <= 0)
            cart_item_errors.push("Quantity must be greater than 0");
        // send all validation errors at once if there are any
        if (cart_item_errors.length > 0)
            return next(validationError({ "cart_item": cart_item_errors }));

        // 2. check if cart exits
        const cart = await Cart.findByPk(cartId);
        if (!cart)
            return next(errorUtils.notFoundError("cart", cartId));

        // 3. check if product exists
        const product = await Product.findByPk(productId);
        if (!product)
            return next(errorUtils.notFoundError("product", productId));

        // 4. check product stock
        if (product.stock < quantity) 
            return next(errorUtils.conflictError({
                stock: `Not enough stock for product ${productId}.`
            }));

        // 5. check if cart already has the product
        const hasProductInCart = await cart.hasProduct(product);
        if (hasProductInCart) 
            return next(errorUtils.conflictError(`Product ${productId} is already in cart ${cartId}.`));

        // FINALLY: add the product to the cart with the specified quantity
        await cart.addProduct(product, { through: { quantity } });

        // UPDATE the product stock by subtracting the quantity added to the cart
        product.stock -= quantity;
        await product.save();

        // return the updated cart with the products in it
        // const updatedCart = await Cart.findByPk(cartId, {
        //     include: {
        //         model: Product,
        //         through: { attributes: ['quantity'] }
        //     }
        // });
        let cartItems = await cart.getProducts();
        // include cart details (like all items in the cart with their quantities) in the response
        const updatedCart = {
            ...cart.toJSON(),
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.cart_item.quantity,
                // add HATEOAS links to the cart items
                links: {
                    product: `/products/${item.id}`,
                    updateQuantity: `/carts/${cartId}/items/${item.id}`,
                    removeItem: `/carts/${cartId}/items/${item.id}`
                }
            }))
        };

        res.status(200).json(updatedCart);
    } catch (error) {
        next(errorUtils.genericError("Error adding item to cart"));
    }
};