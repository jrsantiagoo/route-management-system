import "../env.js";

// Import routes AFTER dotenv.config() so environment variables are loaded
import express from "express";
import cors from "cors";

import managerRoutes from "./routes/manager-routes.js";
import routeRoutes from "./routes/route-routes.js";
import authRoutes from "./routes/auth-routes.js";

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
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Ctrl + C to stop server.");
});
