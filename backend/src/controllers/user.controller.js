import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// Helper to calculate profile completion
const calculateCompletion = (user) => {
  let score = 0;
  if (user.photo && user.photo.trim() !== "") score += 10;
  if (user.about && user.about.trim() !== "") score += 10;
  if (user.location && user.location.trim() !== "") score += 10;
  if (user.experienceYears && user.experienceYears > 0) score += 10;
  if (user.skills && user.skills.length > 0) score += 15;
  if (user.education && user.education.length > 0) score += 15;
  if (user.experience && user.experience.length > 0) score += 15;
  if (user.resume && user.resume.trim() !== "") score += 15;
  return score;
};

// ==========================================
// 1. Profile Core Operations
// ==========================================

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("savedJobs", "title company location salary workMode");
      
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const completion = calculateCompletion(user);

    res.json({
      success: true,
      profileCompletion: completion,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile personal details
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const fieldsToUpdate = [
      "name",
      "photo",
      "about",
      "location",
      "experienceYears",
      "expectedSalary",
      "preferredLocation",
      "noticePeriod",
      "languages",
      "companyName"
    ];

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    const completion = calculateCompletion(user);

    res.json({
      success: true,
      message: "Profile updated successfully",
      profileCompletion: completion,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. Profile Sub-Sections
// ==========================================

export const addSkill = async (req, res) => {
  try {
    const { skillName, level, yearsOfExperience } = req.body;
    if (!skillName) return res.status(400).json({ success: false, message: "Skill name is required" });

    const user = await User.findById(req.user._id);
    const exists = user.skills.some((s) => s.skillName.toLowerCase() === skillName.toLowerCase());
    if (exists) return res.status(400).json({ success: false, message: "Skill already exists" });

    user.skills.push({ skillName, level, yearsOfExperience });
    await user.save();
    res.json({ success: true, message: "Skill added", data: user.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.skills = user.skills.filter((s) => s._id.toString() !== req.params.skillId);
    await user.save();
    res.json({ success: true, message: "Skill removed", data: user.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addEducation = async (req, res) => {
  try {
    const { college, degree, cgpa, year } = req.body;
    if (!college || !degree) return res.status(400).json({ success: false, message: "College and degree are required" });

    const user = await User.findById(req.user._id);
    user.education.push({ college, degree, cgpa, year });
    await user.save();
    res.json({ success: true, message: "Education added", data: user.education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.education = user.education.filter((edu) => edu._id.toString() !== req.params.eduId);
    await user.save();
    res.json({ success: true, message: "Education removed", data: user.education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const { company, position, duration, responsibilities } = req.body;
    if (!company || !position) return res.status(400).json({ success: false, message: "Company and position are required" });

    const user = await User.findById(req.user._id);
    user.experience.push({ company, position, duration, responsibilities });
    await user.save();
    res.json({ success: true, message: "Experience added", data: user.experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.experience = user.experience.filter((exp) => exp._id.toString() !== req.params.expId);
    await user.save();
    res.json({ success: true, message: "Experience removed", data: user.experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCertification = async (req, res) => {
  try {
    const { name, organization, url } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Certification name is required" });

    const user = await User.findById(req.user._id);
    user.certifications.push({ name, organization, url });
    await user.save();
    res.json({ success: true, message: "Certification added", data: user.certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCertification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.certifications = user.certifications.filter((c) => c._id.toString() !== req.params.certId);
    await user.save();
    res.json({ success: true, message: "Certification removed", data: user.certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. Resume Upload & Generation
// ==========================================

export const uploadResumePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Please upload a resume file" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resumeUrl = req.file.path;
    const versionName = `Resume v${user.resumeVersionHistory.length + 1}`;

    user.resume = resumeUrl;
    user.resumeVersionHistory.push({ url: resumeUrl, versionName });
    await user.save();

    res.json({
      success: true,
      message: "Resume uploaded",
      resume: resumeUrl,
      versionHistory: user.resumeVersionHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin-top: 30px; }
          .section-title { font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; text-transform: uppercase; color: #444; }
          .item { margin-bottom: 15px; }
          .item-header { display: flex; justify-content: space-between; font-weight: bold; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
          .skill-tag { background: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${user.name}</h1>
          <p>Email: ${user.email} | Location: ${user.location || "N/A"}</p>
          <p>${user.about || ""}</p>
        </div>
        
        ${user.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-list">
            ${user.skills.map(s => `<span class="skill-tag">${s.skillName} (${s.level} - ${s.yearsOfExperience} yrs)</span>`).join("")}
          </div>
        </div>
        ` : ""}

        ${user.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${user.experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <span>${exp.position} at ${exp.company}</span>
                <span>${exp.duration || ""}</span>
              </div>
              <div style="margin-top: 5px; font-size: 14px;">${exp.responsibilities || ""}</div>
            </div>
          `).join("")}
        </div>
        ` : ""}

        ${user.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${user.education.map(edu => `
            <div class="item">
              <div class="item-header">
                <span>${edu.degree} - ${edu.college}</span>
                <span>Class of ${edu.year || "N/A"}</span>
              </div>
              ${edu.cgpa ? `<div style="font-size: 14px;">CGPA/Percentage: ${edu.cgpa}</div>` : ""}
            </div>
          `).join("")}
        </div>
        ` : ""}
      </body>
      </html>
    `;
    res.json({ success: true, html });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. Saved Jobs Actions
// ==========================================

export const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const user = await User.findById(req.user._id);
    if (user.savedJobs.includes(job._id)) return res.status(400).json({ success: false, message: "Job already saved" });

    user.savedJobs.push(job._id);
    await user.save();
    res.json({ success: true, message: "Job saved", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== req.params.jobId);
    await user.save();
    res.json({ success: true, message: "Job unsaved", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. Dashboards
// ==========================================

export const getCandidateDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("savedJobs", "title company location salary workMode jobType");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const appliedJobs = await Application.find({ candidate: userId })
      .populate({
        path: "job",
        select: "title company location salary workMode jobType status recruiter",
        populate: { path: "recruiter", select: "companyName" },
      })
      .sort({ createdAt: -1 });

    const profileCompletion = calculateCompletion(user);
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(10);
    const userSkillNames = user.skills.map((s) => s.skillName);
    let recommendedJobs = [];

    if (userSkillNames.length > 0) {
      recommendedJobs = await Job.find({
        status: "Published",
        $or: [
          { skillsRequired: { $in: userSkillNames } },
          { title: { $regex: userSkillNames.join("|"), $options: "i" } }
        ],
        deadline: { $gt: new Date() },
      }).limit(5).populate("recruiter", "companyName");
    }

    if (recommendedJobs.length === 0) {
      recommendedJobs = await Job.find({ status: "Published" }).sort({ createdAt: -1 }).limit(5).populate("recruiter", "companyName");
    }

    const recentActivity = [];
    appliedJobs.slice(0, 5).forEach((app) => {
      recentActivity.push({
        type: "application",
        text: `Applied to ${app.job ? app.job.title : "a job"} at ${app.job ? app.job.company : "Company"}`,
        date: app.createdAt,
      });
    });

    user.savedJobs.slice(0, 5).forEach((job) => {
      recentActivity.push({
        type: "saved_job",
        text: `Saved job "${job.title}" at ${job.company}`,
        date: job.createdAt || user.updatedAt,
      });
    });

    notifications.slice(0, 5).forEach((notif) => {
      recentActivity.push({
        type: "notification",
        text: notif.message,
        date: notif.createdAt,
      });
    });

    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        appliedJobs,
        savedJobs: user.savedJobs,
        profileCompletion,
        notifications,
        recommendedJobs,
        recentActivity: recentActivity.slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((job) => job._id);

    const activeJobs = jobs.filter((job) => job.status === "Published" && (!job.deadline || job.deadline > new Date()));
    const allApplications = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "name email photo skills education experience")
      .populate("job", "title company location status");

    const totalApplicants = allApplications.length;
    const pendingApplications = allApplications.filter((app) => app.status === "Applied");
    const shortlistedCandidates = allApplications.filter((app) => app.status === "Shortlisted");
    const interviewsScheduled = allApplications.filter((app) => app.status === "Interview Scheduled");
    const rejectedApplications = allApplications.filter((app) => app.status === "Rejected");

    const analytics = {
      totalJobs: jobs.length,
      activeJobsCount: activeJobs.length,
      draftJobsCount: jobs.filter((job) => job.status === "Draft").length,
      totalApplicants,
      conversionRate: totalApplicants > 0 ? ((shortlistedCandidates.length + interviewsScheduled.length) / totalApplicants * 100).toFixed(1) : 0,
      statusBreakdown: {
        pending: pendingApplications.length,
        shortlisted: shortlistedCandidates.length,
        interviews: interviewsScheduled.length,
        rejected: rejectedApplications.length,
      },
    };

    res.json({
      success: true,
      data: {
        activeJobs,
        totalApplicants,
        interviews: interviewsScheduled,
        shortlistedCandidates,
        pendingApplications,
        analytics,
        allJobs: jobs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. Notifications
// ==========================================

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
    res.json({ success: true, message: "All notifications marked read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
