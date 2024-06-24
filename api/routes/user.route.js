import express from "express";
import { getUserFromToken } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/token", getUserFromToken);

export default router;
