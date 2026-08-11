import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMetadataList,
  createMetadataEntry,
  createReport,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Public Metadata Search/List
router.get("/metadata", getMetadataList);

// Recruiter/Candidate request metadata entry creation
router.post("/metadata", protect, createMetadataEntry);

// Create report/flag
router.post("/reports", protect, createReport);

export default router;
