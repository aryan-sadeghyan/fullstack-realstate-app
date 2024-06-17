import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

import authRouter from "./routes/auth.route.js";

const port = 3000;
const app = express();

app.use(express.json());

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, (req, res) => {
  console.log("server up on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((error, req, res, next) => {
  const statuscode = error.statusCode || 500;
  const message = error.message || "internal server  error";
  return res.send({
    success: false,
    statuscode,
    message,
  });
});
