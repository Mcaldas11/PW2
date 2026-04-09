import products from '../models/products.model.js';
import { notFoundError } from '../utils/error.utils.js';

export const getAllProducts = (req, res) => {
  return res.status(200).json(products);
};

export const getProductById = (req, res, next) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) {
    return next(notFoundError('Product', id));
  }
  return res.status(200).json(product);
};

export const createProduct = (req, res) => {
  const { name, price, stock } = req.body;
  const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = { id: nextId, name, price, stock };
  products.push(newProduct);
  return res.status(201).json(newProduct);
};

export const updateProduct = (req, res, next) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return next(notFoundError('Product', id));
  }
  const { name, price, stock } = req.body;
  const existing = products[index];
  const updated = {
    ...existing,
    name: name !== undefined ? name : existing.name,
    price: price !== undefined ? price : existing.price,
    stock: stock !== undefined ? stock : existing.stock
  };
  products[index] = updated;
  return res.status(200).json(updated);
};

export const deleteProduct = (req, res, next) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return next(notFoundError('Product', id));
  }
  products.splice(index, 1);
  return res.status(204).send();
};
