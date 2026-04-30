import express from 'express';

// import controllers for products resource
import * as productControllers from '../controllers/products.controllers.js';   

const router = express.Router();


router.post('/', productControllers.createProduct);

router.put('/:id', productControllers.updateProduct);

export default router;
