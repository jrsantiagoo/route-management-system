import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import managerRoutes from "./routes/manager-routes.js";
import routeRoutes from "./routes/route-routes.js";
import tripRoutes from "./routes/trip-routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(
    cors({
        origin: process.env.ORIGIN_URI,
    }),
);

app.use("/api/managers", managerRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/trips", tripRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Ctrl + C to stop server.");
});
