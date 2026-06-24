import { Router } from "express";

import * as orderController from "../controllers/order-controller.js";

const router = Router();

router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);
router.put("/package_info/:orderId", orderController.updateOrderPackageInfo);
router.put("/status/:orderId", orderController.updateOrderStatus);

export default router;
