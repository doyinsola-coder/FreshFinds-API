import { Router } from "express";
import { createProduct, getProducts, getProduct, deleteProducts } from "../controllers/product.controllers.js";
import { protect, seller } from "../middlewares/auth.js";

const router = Router();

router.post("/", protect,seller, createProduct);      // Create
router.get("/",protect, getProducts);         // Get all
router.get("/:id",protect, getProduct);       // Get one
router.delete("/:id",protect, seller, deleteProducts) // Delete

export default router;
