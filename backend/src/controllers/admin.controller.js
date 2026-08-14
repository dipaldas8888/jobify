import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Report from "../models/Report.js";
import Metadata from "../models/Metadata.js";

// ==========================================
// 1. User & Recruiter Management
// ==========================================

export const getUsers = async (req, res) => {
  try {
    const { role, isBanned, isVerified } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isBanned) query.isBanned = isBanned === "true";
    if (isVerified) query.isVerified = isVerified === "true";

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "admin") return res.status(400).json({ success: false, message: "Admin users cannot be banned" });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ success: true, message: `User ${user.isBanned ? "banned" : "unbanned"}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const { role, name, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (role) user.role = role;
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ success: true, message: "User updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. Job Moderation
// ==========================================

export const getJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate("recruiter", "name email companyName");
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: "Job removed by Admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    job.status = "Published";
    await job.save();
    res.json({ success: true, message: "Job approved and published live!", data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompaniesAdmin = async (req, res) => {
  try {
    const metadataCompanies = await Metadata.find({ type: "Company" }).populate("createdBy", "name email");
    const recruiterUsers = await User.find({ role: "recruiter", companyName: { $exists: true, $ne: "" } }).select("name email companyName createdAt");

    const companyMap = new Map();

    metadataCompanies.forEach(c => {
      companyMap.set(c.name.toLowerCase(), {
        id: c._id,
        name: c.name,
        industry: c.description || "Technology Partner",
        createdBy: c.createdBy ? c.createdBy.email : "System",
        status: c.isApproved ? "Verified" : "Pending",
        createdAt: c.createdAt,
      });
    });

    recruiterUsers.forEach(u => {
      if (!companyMap.has(u.companyName.toLowerCase())) {
        companyMap.set(u.companyName.toLowerCase(), {
          id: u._id,
          name: u.companyName,
          industry: "Employer Partner",
          createdBy: u.email,
          status: "Verified",
          createdAt: u.createdAt,
        });
      }
    });

    const companiesList = Array.from(companyMap.values());
    res.json({ success: true, count: companiesList.length, data: companiesList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. Reports Moderation
// ==========================================

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate("reportedBy", "name email")
      .populate("job", "title company")
      .populate("reportedUser", "name email role")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { actionTaken } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status: "Resolved", actionTaken }, { new: true });
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, message: "Report resolved", data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { jobId, reportedUserId, reason } = req.body;
    const report = await Report.create({
      reportedBy: req.user._id,
      job: jobId || undefined,
      reportedUser: reportedUserId || undefined,
      reason,
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. Metadata Directory (Category, Skill, Company)
// ==========================================

// @desc    Get metadata list (categories, skills, companies)
// @route   GET /api/metadata (Public)
export const getMetadataList = async (req, res) => {
  try {
    const { type, search, isApproved } = req.query;
    const query = {};
    if (type) query.type = type;
    if (isApproved) query.isApproved = isApproved === "true";
    if (search) query.name = { $regex: search, $options: "i" };

    const list = await Metadata.find(query).populate("createdBy", "name email");
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create metadata entry
// @route   POST /api/metadata (Public/Recruiter/Admin based on type)
export const createMetadataEntry = async (req, res) => {
  try {
    const { type, name, description, website, logo, location } = req.body;
    
    // Only admins can create categories or skills
    if ((type === "Category" || type === "Skill") && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can add skills or categories" });
    }

    const companyApproval = req.user.role === "admin"; // Admin added company is auto-approved

    const entry = await Metadata.create({
      type,
      name,
      description,
      website,
      logo,
      location,
      isApproved: companyApproval,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update metadata entry (e.g. approve company, update category)
// @route   PUT /api/admin/metadata/:id (Admin only)
export const updateMetadataAdmin = async (req, res) => {
  try {
    const entry = await Metadata.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: "Metadata entry not found" });
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete metadata entry
// @route   DELETE /api/admin/metadata/:id (Admin only)
export const deleteMetadataAdmin = async (req, res) => {
  try {
    const entry = await Metadata.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Metadata entry not found" });
    res.json({ success: true, message: "Metadata entry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. System Analytics
// ==========================================

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "candidate" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalJobs = await Job.countDocuments({});
    const activeJobs = await Job.countDocuments({
      status: "Published",
      $or: [
        { deadline: { $exists: false } },
        { deadline: null },
        { deadline: { $gt: new Date() } }
      ]
    });
    const totalApplications = await Application.countDocuments({});
    const totalReports = await Report.countDocuments({ status: "Pending" });
    const totalCompanies = await Metadata.countDocuments({ type: "Company" });

    const usersTrend = await User.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        activeJobs,
        totalApplications,
        totalReports,
        totalCompanies,
        usersTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
