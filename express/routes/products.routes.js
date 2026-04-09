import express from 'express';
import * as ProductsController from '../controllers/products.controllers.js';
import { validateProductData } from '../middlewares/products.validation.js';

const router = express.Router();

router.route('/').get(ProductsController.getAllProducts).post(validateProductData, ProductsController.createProduct);

router
  .route('/:id')
  .get(ProductsController.getProductById)
  .put(validateProductData, ProductsController.updateProduct)
  .delete(ProductsController.deleteProduct);

export default router;
