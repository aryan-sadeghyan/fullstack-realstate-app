import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing);
router.get("/getuserlisting/:id", getListing);
router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
