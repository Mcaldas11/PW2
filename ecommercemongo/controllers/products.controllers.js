// import sequelize models
import { Product } from "../models/db.config.js";
// import error utils
import { conflictError, validationError, sequelizeValidationError, missingFieldsValidationError, notFoundError, genericError } from "../utils/error.utils.js";
// import * as errorUtils from "../utils/error.utils.js";  


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
        const sortDirection = sort? sort.split(':')[1].toUpperCase() : null;
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
        const { id } = req.params;
        const { name, price, stock } = req.body;

        const updateProduct = await Product.findByIdAndUpdate(id,
            { name, price, stock },
            {
                runValidators: true, // to run the validators defined in the model
                returnDocument: "after" // to return the updated document
            }).select("-__v"); // exclude __v field from the response

        if (!updateProduct) {
            return next(errorUtils.notFoundError("product", id));
        }
            res.json(updateProduct);
        } catch (error) {
            if (error.name === "CastError") 
                return next(errorUtils.mongooseCastError(error));

            if (error.name === "ValidationError") 
                return next(errorUtils.mongooseValidationError(error.errors));
        
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
        // if the error is a SequelizeForeignKeyConstraintError, 
        // it means that the product is still referenced in a cart, 
        // so we send a specific error message for that case
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return next(conflictError({ product: "Cannot delete product that is still in a cart"}));
        }
        next(genericError("Error deleting product"));
    }
};
