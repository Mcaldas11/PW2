import express from "express";

// import controllers for products resource
import * as productControllers from "../controllers/products.controllers.js";
import {
  verifyToken,
  requireAdmin,
  requireRole,
} from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", verifyToken, requireAdmin, productControllers.createProduct);
router.put("/:id", verifyToken, requireRole, productControllers.updateProduct);
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  productControllers.deleteProduct,
);

export default router;