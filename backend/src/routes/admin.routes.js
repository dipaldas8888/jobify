import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  getUsers,
  toggleUserBan,
  updateUserAdmin,
  deleteUser,
  getJobsAdmin,
  deleteJobAdmin,
  approveJobAdmin,
  getCompaniesAdmin,
  getReports,
  resolveReport,
  updateMetadataAdmin,
  deleteMetadataAdmin,
  getAdminAnalytics,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Require Admin privileges for all endpoints
router.use(protect, authorize("admin"));

// Users
router.get("/users", getUsers);
router.put("/users/:id/ban", toggleUserBan);
router.put("/users/:id", updateUserAdmin);
router.delete("/users/:id", deleteUser);

// Jobs
router.get("/jobs", getJobsAdmin);
router.put("/jobs/:id/approve", approveJobAdmin);
router.delete("/jobs/:id", deleteJobAdmin);

// Companies
router.get("/companies", getCompaniesAdmin);


// Reports
router.get("/reports", getReports);
router.put("/reports/:id/resolve", resolveReport);

// Metadata admin actions (categories, skills, companies)
router.put("/metadata/:id", updateMetadataAdmin);
router.delete("/metadata/:id", deleteMetadataAdmin);

// Analytics
router.get("/analytics", getAdminAnalytics);

export default router;
