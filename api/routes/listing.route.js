import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing);
router.get("/getuserlistings/:id", getListings);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:listingId", verifyToken, updateListing);
router.get("/getlisting/:listingId", getListing);

export default router;
