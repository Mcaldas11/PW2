import express from 'express';

// import controllers for carts resource
import * as cartControlllers from '../controllers/carts.controllers.js';    

const router = express.Router();

router.post('/', cartControlllers.create);
router.post('/:cartId/items', cartControlllers.addItem);

export default router;
