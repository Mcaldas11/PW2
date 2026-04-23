// import sequelize models
import { Product } from "../models/db.config.js";

// import Sequelize operators, for like queries in getAllProducts
import { Op } from 'sequelize';

// import error utils
import { validationError, sequelizeValidationError, missingFieldsValidationError, notFoundError, genericError } from "../utils/error.utils.js";

// controller to get all products (async/await version)
export const getAllProducts = async (req, res, next) => {
    try {
        // optional filtering by name and sorting by price
        const { name, sort } = req.query;

        // validate query parameteres 
        if (sort && (sort !== "price:asc" && sort !== "price:desc")) {
            const error = validationError({ sort: ['Invalid sort parameter. Use "price:asc" or "price:desc"'] });
            return next(error);
        }

        // define where clause for filtering by name (if name query parameter is provided)
        const where = name ? { name: { [Op.like]: `%${name}%` } } : {};

        // define order clause for sorting by price (if sort query parameter is provided)
        const sortDirection = sort.split(':')[1].toUpperCase()
        const order = sort ? [['price', sortDirection]] : [];

        // fetch products from DB with optional filtering and sorting
        const products = await Product.findAll({ where, order });

        // add hateoas links to the response: 
        // for each product, add a "links" property with self, update and delete links
        const productsList = products.map(product => ({
            ...product.toJSON(),
            links: {
                self: { href: `/products/${product.id}` },
                update: { href: `/products/${product.id}`, method: "PUT" },
                delete: { href: `/products/${product.id}`, method: "DELETE" }
            }
        }));
        // global links: add link to create a new product
        const response = {
            data: productsList,
            links: {
                create: { href: "/products", method: "POST" }
            }
        };
        res.json(response);
    } catch (error) {
        next(genericError("Error fetching products"));
    }
};

// controller to get a product by id
export const getProductById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            next(notFoundError("product", id));
        }

        // add hateoas links to the response
        const productResponse = {
            ...product.toJSON(),
            links: {
                self: { href: `/products/${product.id}` },
                update: { href: `/products/${product.id}`, method: "PUT" },
                delete: { href: `/products/${product.id}`, method: "DELETE" },
                allProducts: { href: "/products", method: "GET" }
            }
        };
        res.json(productResponse);

    } catch (error) {
        next(genericError("Error fetching product"));
    }
};


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

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // OPTION 1: delete product directly by id
        // const deleted = await Product.destroy({ where: { id } });
        // if (deleted === 0) 
        //     return next(notFoundError("product", id));

        // OPTION 2: find product by id, then delete it 
        const product = await Product.findByPk(id);
        if (!product)
            return next(notFoundError("product", id));

        // delete product in DB
        await product.destroy();

        // send no content response
        res.status(204).send();

    } catch (error) {
        next(genericError("Error deleting product"));
    }
};
