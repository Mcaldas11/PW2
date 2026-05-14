// import mongoose models
import { Product, Cart } from "../models/db.config.js";

// import all functions from error utils
import * as errorUtils from "../utils/error.utils.js";


// controller to get all products (async/await version)
export const getAllProducts = async (req, res, next) => {
    try {
        // optional filtering by name and sorting by price
        const { name, sort, page, limit } = req.query;

        // validate query parameteres 
        let query_errors = []; // format: { parameterName: [error1, error2, ...] }
        if (sort && (sort !== "price:asc" && sort !== "price:desc"))
            query_errors.push({ sort: ['Invalid sort parameter. Use "price:asc" or "price:desc".'] });
        // return next(errorUtils.validationError({ sort: ['Invalid sort parameter. Use "price:asc" or "price:desc"'] }));

        if (page !== undefined && (!Number.isInteger(page) || parseInt(page) <= 0))
            query_errors.push({ page: ['Invalid page parameter. Use a positive integer.'] });

        if (limit !== undefined && (!Number.isInteger(limit) || parseInt(limit) <= 0))
            query_errors.push({ limit: ['Invalid limit parameter. Use a positive integer.'] });

        // send all validation errors at once if there are any
        if (query_errors.length > 0)
            return next(errorUtils.validationError(query_errors));


        // define where clause for filtering by name (if name query parameter is provided)
        const query = {};
        if (name) query.name = new RegExp(name, 'i'); // case insensitive search

        //  define order clause for sorting by price (if sort query parameter is provided)
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            sortOptions[field] = order === "asc" ? 1 : -1;
        }

        // set pagination options with default values
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        // fetch products from DB with optional filtering and sorting
        const products = await Product.find(query).sort(sortOptions)
            .select('-__v') // remove version field from the response
            .skip(skip)
            .limit(limitNumber);

        // count total products for pagination metadata
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // add hateoas links to the response: 
        // for each product, add a "links" property with self, update and delete links
        const productsList = products.map(product => ({
            ...product.toJSON(),
            links: {
                update: { href: `/products/${product._id}`, method: "PUT" },
                delete: { href: `/products/${product._id}`, method: "DELETE" }
            }
        }));
        // global links: add link to create a new product
        const response = {
            pagination: {
                totalProducts,
                totalPages: totalPages,
                currentPage: pageNumber
            },
            data: productsList,
            links: {
                create: { href: "/products", method: "POST" },
                ...(pageNumber < totalPages ? { nextPage: { href: `/products?page=${pageNumber + 1}&limit=${limitNumber}`, method: "GET" } } : null),
                ...(pageNumber > 1 ? { prevPage: { href: `/products?page=${pageNumber - 1}&limit=${limitNumber}`, method: "GET" } } : null)
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error fetching products:", error);
        next(errorUtils.genericError("Error fetching products"));
    }
};

// controller to create a new product
export const createProduct = async (req, res, next) => {
    try {
        const { name, price, stock } = req.body;

        // // create a new product instance with the data from the request body
        // const newProduct = new Product({ name, price, stock });
        // const savedProduct = await newProduct.save();

        // OR create and save the product in one step 
        const savedProduct = await Product.create({ name, price, stock });

        // either way, mongoose validation errors will be thrown if the data is invalid

        // add hateoas links to the response
        const productResponse = {
            ...savedProduct.toJSON(),
            links: {
                allProducts: { href: "/products", method: "GET" },
                delete: { href: `/products/${savedProduct.id}`, method: "DELETE" }
            }
        };
        res.status(201).json(productResponse);
    } catch (error) {
        // detect specific validation errors and send appropriate response
        if (error.name === "ValidationError") {
            // console.error("Mongoose validation error:", error);
            next(errorUtils.mongooseValidationError(error.errors));
        }
        else {
            // send generic error to express error handling middleware
            next(errorUtils.genericError("Error creating product"));
        }
    }
};

// controller to update a product by id
export const updateProduct = async (req, res, next) => {
    try {

        // update product using mongoose
        const { id } = req.params;
        const { name, price, stock } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id,
            { name, price, stock },
            {
                runValidators: true,  // run validators on update 
                returnDocument: 'after' // return the updated product in the response
            }).select('-__v');  // exclude __v field from the response

        if (!updatedProduct)
            return next(errorUtils.notFoundError("product", id));

        res.json(updatedProduct);
    } catch (error) {
        // mongoose CastError: invalid ID format 
        if (error.name === "CastError")
            return next(errorUtils.mongooseCastError(error));

        // specific validation errors
        if (error.name === "ValidationError")
            return next(errorUtils.mongooseValidationError(error.errors));

        // generic error 
        next(errorUtils.genericError("Error updating product"));
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. verify if product exists in any cart 
        const cartsWithProduct = await Cart.find({ "items.product": id });
        if (cartsWithProduct.length > 0)
            return next(errorUtils.conflictError(`Cannot delete product because it is in one or more carts.`));


        // // 2. check if product exists        
        // const product = await Product.findById(id).exec();
        // if (!product)
        //     return next(errorUtils.notFoundError("product", id));

        // // 3. delete product in DB
        // await product.deleteOne();

        // OR 2 and 3 in one step with findByIdAndDelete (faster!)
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
            return next(errorUtils.notFoundError("product", id));

        // send no content response
        res.status(204).send();

    } catch (error) {
        if (error.name === "CastError")
            return next(errorUtils.mongooseCastError(error));

        next(errorUtils.genericError("Error deleting product"));
    }
};
