import { Router } from "express";
import { checkout, verifyPayment, getOrders, getOrder, updateOrderStatus, getAllOrders } from "../controllers/orders.controllers.js";
import { protect, admin, user } from "../middlewares/auth.js";

const router = Router();

router.post("/checkout", protect, user, checkout);
router.get("/verify-payment",  verifyPayment);
router.get("/", protect, user, getOrders);
router.get("/all", protect, admin, getAllOrders);
router.get("/:id", protect, getOrder);
router.put("/:id", protect, admin, updateOrderStatus);

export default router;