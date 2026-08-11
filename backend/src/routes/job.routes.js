import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} from "../controllers/job.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public Search
router.route("/").get(getJobs);

// Candidate my applications
router.get(
  "/applications/my",
  protect,
  authorize("candidate"),
  getMyApplications
);

// Application Status Update
router.put(
  "/applications/:applicationId/status",
  protect,
  authorize("recruiter", "admin"),
  updateApplicationStatus
);

// Job Posting & Operations
router.post("/", protect, authorize("recruiter", "admin"), createJob);

router
  .route("/:id")
  .get(getJobById)
  .put(protect, authorize("recruiter", "admin"), updateJob)
  .delete(protect, authorize("recruiter", "admin"), deleteJob);

// Application Actions
router.post(
  "/:jobId/apply",
  protect,
  authorize("candidate"),
  uploadResume.single("resume"),
  (req, res, next) => {
    if (req.file) {
      req.body.resumeUrl = req.file.path;
    }
    next();
  },
  applyForJob
);

router.get(
  "/:jobId/applicants",
  protect,
  authorize("recruiter", "admin"),
  getJobApplicants
);

export default router;
