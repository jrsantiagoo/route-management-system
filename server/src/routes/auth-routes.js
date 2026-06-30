import { Router } from "express";
import { register, login, refreshToken, changePassword, logout } from "../controllers/auth-controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);
router.put("/change-password", authenticate, changePassword);

export default router;
