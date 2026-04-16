import express from 'express';

// import controllers for products resource
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controllers.js';    

// import validation middleware for products resource
import { validateProduct } from '../middlewares/products.validations.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validateProduct, createProduct);

router.put('/:id', validateProduct,updateProduct);
router.delete('/:id', deleteProduct);

export default router;
