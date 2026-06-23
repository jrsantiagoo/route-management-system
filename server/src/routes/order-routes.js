import { Router } from "express";

import * as orderController from "../controllers/order-controller.js";

const router = Router();

router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);

export default router;
