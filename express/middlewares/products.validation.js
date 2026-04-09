import { validationError } from '../utils/error.utils.js';

export const validateProductData = (req, res, next) => {
  const { name, price, stock } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = ['Name is required'];
  }

  if (price === undefined || typeof price !== 'number' || price <= 0) {
    errors.price = ['Price is required and must be a positive number'];
  }

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    errors.stock = ['Stock must be a positive integer'];
  }

  if (Object.keys(errors).length) return next(validationError(errors));
  return next();
};
