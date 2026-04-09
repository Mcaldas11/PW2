import express from 'express';
const router = express.Router();

import * as UserController from "../controllers/user.controller.js";
import { validateUserData } from '../middlewares/user.validation.js';
import cartsRoutes from './carts.routes.js';

router.route('/')
    .post(validateUserData, UserController.createUser)
router.route('/login')
    .post(UserController.login)
router.route('/me/orders')
    .get(UserController.getUserOrders)
router.route('/me/cart', cartsRoutes)

export default router