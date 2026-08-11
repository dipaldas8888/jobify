import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  addSkill,
  removeSkill,
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
  addCertification,
  removeCertification,
  uploadResumePdf,
  generateResume,
  saveJob,
  unsaveJob,
  getCandidateDashboard,
  getRecruiterDashboard,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);

// Dashboards
router.get("/dashboard/candidate", authorize("candidate"), getCandidateDashboard);
router.get("/dashboard/recruiter", authorize("recruiter"), getRecruiterDashboard);

// Notifications
router.get("/notifications", getMyNotifications);
router.put("/notifications/read-all", markAllNotificationsRead);
router.put("/notifications/:id/read", markNotificationRead);

// Profile Core
router.route("/profile").get(getUserProfile).put(updateUserProfile);

// Profile Sub-sections
router.post("/profile/skills", addSkill);
router.delete("/profile/skills/:skillId", removeSkill);

router.post("/profile/education", addEducation);
router.delete("/profile/education/:eduId", removeEducation);

router.post("/profile/experience", addExperience);
router.delete("/profile/experience/:expId", removeExperience);

router.post("/profile/certifications", addCertification);
router.delete("/profile/certifications/:certId", removeCertification);

// Resume upload and generation
router.post("/profile/resume", uploadResume.single("resume"), uploadResumePdf);
router.get("/profile/resume/generate", generateResume);

// Save / Unsave Jobs
router.post("/jobs/:jobId/save", saveJob);
router.delete("/jobs/:jobId/save", unsaveJob);

export default router;
