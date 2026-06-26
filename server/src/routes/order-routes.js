import { Router } from "express";

import * as orderController from "../controllers/order-controller.js";

const router = Router();

router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrderById);
router.get("/trip_orders/:tripId", orderController.getTripOrders);
router.post("/", orderController.createOrder);
router.put("/package_info/:orderId", orderController.updateOrderPackageInfo);
router.put("/status/:orderId", orderController.updateOrderStatus);
router.put("/assign/:orderId", orderController.assignOrderToTrip);
router.delete("/:orderId", orderController.deleteOrder);

export default router;
