import { validationError } from "../utils/error.utils.js";
export const validateProductData = (req, res, next) => {
    const { name, price, stock } = req.body;

    // Validate name
    if (!name) {
        validationError({message: 'Name is required'})
    }

    // Validate price
    if (!price || typeof price !== 'number' || price <= 0) {
        validationError({ message: 'Price is required and must be a positive number' })
    }
    
    // Validate stock
    if (stock && (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0)) {
        validationError({ message: 'Stock must be a positive integer' })
    }
    next();
};