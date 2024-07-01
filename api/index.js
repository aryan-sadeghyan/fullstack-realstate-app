import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import prisma from "../prisma/prismaClient.js"; // Adjust the import path as necessary
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import path from "path";

dotenv.config();

const port = 3000;
const app = express();

const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist"));
});

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
