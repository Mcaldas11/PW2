import express from 'express';
const router = express.Router();

import * as ProductsController from "../controllers/products.controller.js";
import { validateProductData } from '../middlewares/products.validation.js';

router.route('/')
    .get(ProductsController.getAllProducts)
    .post(validateProductData, ProductsController.createProduct);
router.route('/:id')
    .get(ProductsController.getProductById)
    .put(validateProductData, ProductsController.updateProduct)
    .delete(ProductsController.deleteProduct);

export default router;