// import sequelize models
import { Product } from "../models/db.config.js";

// import Sequelize operators, for like queries in getAllProducts
import { Op } from 'sequelize';

// import error utils
import { conflictError, validationError, sequelizeValidationError, missingFieldsValidationError, notFoundError, genericError } from "../utils/error.utils.js";
// import * as errorUtils from "../utils/error.utils.js";  

// controller to create a new product
export const createProduct = async (req, res, next) => {
    try {
        //sequelize will automatically validate the input based on the model definition and throw an error if validation fails
        const newProduct = await Product.create(req.body);
        // add hateoas links to the response
        const productResponse = {
            ...newProduct.toJSON(),
            links: {
                allProducts: { href: "/products", method: "GET" },
                self: { href: `/products/${newProduct.id}` },
                update: { href: `/products/${newProduct.id}`, method: "PUT" },
                delete: { href: `/products/${newProduct.id}`, method: "DELETE" }
            }
        };
        res.status(201).json(productResponse);
    } catch (error) {
        // detect specific validation errors and send appropriate response
        if (error.name === "SequelizeValidationError") {
            next(sequelizeValidationError(error.errors));
        }
        else {
            // send generic error to express error handling middleware
            next(genericError("Error creating product"));
        }
    }
};

// controller to update a product by id
export const updateProduct = async (req, res, next) => {
    try {
        // sequelize update method allows PARTIAL updates, 
        // so we NEED to check for missing fields (since it is a PUT endpoint, not PATCH) 
        // and send an error if any required field is missing in the request body
        let missingFields = [];
        if (!req.body.name) missingFields.push("Name");
        if (!req.body.price) missingFields.push("Price");

        // if there are missing fields, send a validation error
        if (missingFields.length > 0) {
            return next(missingFieldsValidationError(missingFields));
        }

        // find product by id, then update it
        // sequelize UPDATE method DOES NOT return the updated product, 
        // so we need to always find the product first, then update it, 
        // to be able to return the updated product in the response
        const { id } = req.params;
        // find product by id
        const product = await Product.findByPk(id);
        // if product not found, send to error handling middleware
        if (!product) {
            return next(notFoundError("product", id));
        }

        // update product in DB with new data from request body
        await product.update(req.body);

        // send response with updated product
        res.json(product);

    } catch (error) {
        // detect specific validation errors and send appropriate response
        if (error.name === "SequelizeValidationError") {
            return next(sequelizeValidationError(error.errors));
        }
        // or send generic error 
        next(genericError("Error updating product"));
    }
};
