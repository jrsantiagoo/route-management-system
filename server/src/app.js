import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Ctrl + C to stop server.");
});
