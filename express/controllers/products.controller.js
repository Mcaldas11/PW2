import products from "../models/products.model.js";
import { notFoundError, validationError } from '../utils/error.utils.js'

export const getAllProducts = (req, res) => {
    const { name, sort } = req.query;
    // Validate sort parameter if provided
    if (sort && !['price|asc', 'price|desc'].includes(sort) ) {
        throw validationError({sort: ['Invalid sort parameter. Use "price|asc" or "price|desc "']});
    }
    let result = [... products];

    if (name) {
        const nameLower = name.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(nameLower));
    }
    if (sort) {
        if (sort === 'price|asc')
            result.sort((a, b) => a.price - b.price);
        else if (sort === 'price|desc')
            result.sort((a, b) => b.price - a.price);
    }
    res.json(result);
}

export const getProductById = (req, res) => {
    const id = Number(req.params.id);
    const product =  products.find(p => p.id === id)

    if(!product) {
        throw notFoundError("Products",id)
    }
    res.json(product);
}

export const createProduct = (req, res) => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1: 1;

    const {name, price, stock} = req.body;

    const newProduct = {id: nextId, name, price, stock};
    products.push(newProduct)
    res.status(201).json(newProduct)
}

export const updateProduct = (req, res) => {
    const id = Number(req.params.id);
    const {name, price, stock} = req.body;

    products = products.map(p => p.id === id ? {...p, name, price, stock} : p);
    res.status(200).json({name, price, stock})
}

export const deleteProduct = (req, res) => {
    const id = Number(req.params.id)
    products = products.filter(p => p.id == id)
    res.status(200).json({message:"Product Successfully deleted"})
}