import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8080;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(
    cors({
        origin: process.env.ORIGIN_URI,
    }),
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Ctrl + C to stop server.");
});
