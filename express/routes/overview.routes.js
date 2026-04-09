import express from 'express';
const router = express.Router()

import * as OverviewController from "../controllers/overview.controllers.js"
import {} from "../middlewares/overview.validation.js"

router.route('/orders')
    .get(OverviewController.getOrders)
router.route('/carts')
    .get(OverviewController.getCarts)

export default router