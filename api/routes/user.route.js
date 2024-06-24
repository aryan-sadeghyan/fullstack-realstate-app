import express from "express";
import {
  getUserFromToken,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/token", getUserFromToken);
router.post("/update/:id", verifyToken, updateUser);

export default router;
