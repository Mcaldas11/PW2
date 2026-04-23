import express from "express";

import * as cartControllers from "../controllers/cart.controllers.js";

const router = express.Router();

router.post("/", cartControllers.createCart);

router.post('/:cartId/products', cartControllers.addItem);

export default router;