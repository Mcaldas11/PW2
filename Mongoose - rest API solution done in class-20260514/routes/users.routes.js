import express from "express";

import * as userControllers from "../controllers/users.controllers.js";

import {verifyToken} from "../middlewares/auth.middlewares.js";

const router = express.Router();


router.post('/', userControllers.register);
router.post('/login', userControllers.login);


router.post('/me/cart', verifyToken, userControllers.createCart);



export default router;
