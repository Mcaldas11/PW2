// import products data
import { products } from '../models/products.model.js';

 // controller to get all products
export const getAllProducts = (req, res) => {
    res.json(products);
};

// controller to get a product by id
export const getProductById = (req, res) => {
    const { id } = req.params;
    // find product by id
    const product = products.find(p => p.id === Number(id));  
    // if product not found, send to error handling middleware
    if (!product) {
        //return res.status(404).json({ message: 'Product not found' });
        const error = new Error(`Product with id ${id} not found`);
        error.status = 404;
        throw error;
    }
    res.json(product);
};

// controller to create a new product
export const createProduct = (req, res) => {
    const { name, price, stock } = req.body;

    // calculate new ID
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // create new product object
    const newProduct = {
        id: nextId,
        name,price, 
        // stock is optional
        stock: stock? stock: 0
    };  
    // add new product to products array
    products.push(newProduct);

    // send response with new product
    res.status(201).json(newProduct);
};

// controller to update a product by id
export const updateProduct = (req, res) => {
        const { id } = req.params;
        const { name, price, stock } = req.body;

        // find product by id
        const productIndex = products.findIndex(
            p => p.id === Number(id));  
        // if product not found, send to error handling middleware
        if (productIndex === -1) {
            const error = new Error(`Product with id ${id} not found`);
            error.status = 404;
            throw error;
        }

        // update product
        const updatedProduct = {
            id: productIndex,
            name, price,
            stock: stock? stock: products[productIndex].stock
        };
        // update product in products array
        products[productIndex] = updatedProduct;

        // send response with updated product
        res.json(updatedProduct);
};

export const deleteProduct = (req, res) => {
     const { id } = req.params;

    // find product by id
    const productIndex = products.findIndex(p => p.id === Number(id));
    
    // if product not found, send to error handling middleware
    if (productIndex === -1) {
        const error = new Error(`Product with id ${id} not found`);
        error.status = 404;
        throw error;
    }

    // remove product from products array
    products.splice(productIndex, 1);

    // send no content response
    res.status(204).send();
};