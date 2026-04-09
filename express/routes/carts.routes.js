import express from 'express';
const router = express.Router();

import * as CartsController from "../controllers/carts.controller.js";
import {} from "../middlewares/carts.validation.js";

router.route('/')
    .get(CartsController.getUserCart)
router.route('/items')
    .post(CartsController.addItem)
router.route('items/:itemId')
    .patch(CartsController.updateItem)
    .delete(CartsController.deleteItem)
router.route('checkout')
    .post(CartsController.checkout)

export default router;