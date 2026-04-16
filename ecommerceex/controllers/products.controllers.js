// import products data
import { Product } from '../models/db.config.js';
import { Op } from 'sequelize';

 // controller to get all products
export const getAllProducts = async (req, res, next) => {
    try {
        // const products = await Product.findAll();
        // return res.json(products);

        // optional query parameters: name and sort : price|asc or ptice|desc
        const { name, sort } = req.query;
        
        if ( sort && !['price|asc', 'price|desc'].includes(sort)) {
            const err = new Error('Validation failed');
            err.status = 400;
            err.errors = {sort: 'Sort must be price|asc or price|desc'}
            return next(err);
        }

        const where = name ? { name: {[Op.like]: `%${name}%`} } : {};

        const order = sort ? [['price', sort.split('|')[1].toUpperCase()]] : [];

        const products = await Product.findAll({ where, order });
        return res.json(products);

    } catch (error) {
        const err = new Error('Database error');
        err.status = 500;
        return next(err);
    }
};

// controller to get a product by id
export const getProductById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        return res.json(product);
    } catch (error) {
        const err = new Error('Database error');
        err.status = 500;
        return next(err);
    }
    
};

// controller to create a new product
export const createProduct = async (req, res, next) => {
    console.log(req.body);
    try {
        console.log("helloooooo") ;
        const newProduct = await Product.create(req.body);
        console.log(newProduct);
        return res.status(201).json(newProduct);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(e => e.message);
            const err = new Error('Validation error');
            err.status = 400;
            err.errors = validationErrors;
            return next(err);
        } else {
            const err = new Error('Database error');
            err.status = 500;
            return next(err);
        }
}};

// controller to update a product by id
export const updateProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        await product.update(req.body);
        return res.json(product);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(e => e.message);
            const err = new Error('Validation error');
            err.status = 400;
            err.errors = validationErrors;
            return next(err);
        } else {
            const err = new Error('Database error');
            err.status = 500;
            return next(err);
        }
    }    
};

export const deleteProduct = async(req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        await product.destroy();
        res.status(204).send();
    } catch (error) {
        const err = new Error('Database error');
        err.status = 500;
        return next(err);
    }
};