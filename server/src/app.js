// App assembly lives here so tests can mount it without starting a listener.
import express from "express";
import cors from "cors";

import managerRoutes from "./routes/manager-routes.js";
import routeRoutes from "./routes/route-routes.js";
import authRoutes from "./routes/auth-routes.js";
import tripRoutes from "./routes/trip-routes.js";
import driverRoutes from "./routes/driver-routes.js";
import orderRoutes from "./routes/order-routes.js";
import fuelLogRoutes from "./routes/fuel-log-routes.js";
import efficiencyRoutes from "./routes/efficiency-routes.js";

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(
    cors({
        origin: process.env.ORIGIN_URI,
    }),
);

// Lightweight health check (used by tooling / Playwright webServer readiness).
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/managers", managerRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/fuel_logs", fuelLogRoutes);
app.use("/api/efficiency", efficiencyRoutes);

export default app;
