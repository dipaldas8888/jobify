import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// ==========================================
// 1. Job Postings & Search
// ==========================================

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      experience,
      skillsRequired,
      jobType,
      workMode,
      description,
      deadline,
      status,
      education,
      openings,
    } = req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      experience,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? [skillsRequired] : []),
      jobType,
      workMode,
      description,
      deadline,
      status: status || "Published",
      education,
      openings: openings || 1,
      recruiter: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json({ success: true, data: createdJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Owner Recruiter/Admin)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    if (req.body.skillsRequired && !Array.isArray(req.body.skillsRequired)) {
      req.body.skillsRequired = [req.body.skillsRequired];
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner Recruiter/Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Job successfully removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get details of a single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name companyName email");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get / Search all jobs with advanced filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      workMode,
      minSalary,
      experience,
      skills,
      company,
      postedToday,
      last7Days,
      education,
    } = req.query;

    const query = {};
    query.status = "Published";

    query.$or = [
      { deadline: { $exists: false } },
      { deadline: null },
      { deadline: { $gt: new Date() } }
    ];

    if (keyword) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { skillsRequired: { $regex: keyword, $options: "i" } },
        ],
      });
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      if (Array.isArray(jobType)) {
        query.jobType = { $in: jobType };
      } else {
        query.jobType = jobType;
      }
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (minSalary) {
      query.salary = { $gte: Number(minSalary) };
    }

    if (experience) {
      query.experience = { $regex: experience, $options: "i" };
    }

    if (education) {
      query.education = { $regex: education, $options: "i" };
    }

    if (skills) {
      const skillsList = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
      query.skillsRequired = { $in: skillsList.map(s => new RegExp(s, "i")) };
    }

    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    if (postedToday === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: today };
    } else if (last7Days === "true") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: sevenDaysAgo };
    }

    const jobs = await Job.find(query).populate("recruiter", "companyName name photo");
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. Job Applications Management
// ==========================================

// @desc    Candidate applies for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private (Candidate)
export const applyForJob = async (req, res) => {
  const { jobId } = req.params;
  const { resumeUrl, coverLetter } = req.body;

  try {
    const job = await Job.findById(jobId).populate("recruiter");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.status !== "Published") {
      return res.status(400).json({ success: false, message: "This job is not accepting applications" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl: resumeUrl || req.user.resume,
      coverLetter,
    });

    if (!application.resumeUrl) {
      await Application.findByIdAndDelete(application._id);
      return res.status(400).json({ success: false, message: "Please upload or specify a resume PDF" });
    }

    // Notify recruiter
    await Notification.create({
      recipient: job.recruiter._id,
      sender: req.user._id,
      title: "New Application Received",
      message: `${req.user.name} applied for "${job.title}"`,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get candidate's own applications
// @route   GET /api/jobs/applications/my
// @access  Private (Candidate)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title company location status salary jobType workMode")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Recruiter views applicants for a specific job
// @route   GET /api/jobs/:jobId/applicants
// @access  Private (Recruiter/Admin)
export const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these applicants",
      });
    }

    const applicants = await Application.find({ job: jobId }).populate(
      "candidate",
      "name email skills education experience photo about location"
    );
    res.json({ success: true, count: applicants.length, data: applicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Recruiter updates application status
// @route   PUT /api/jobs/applications/:applicationId/status
// @access  Private (Recruiter/Admin)
export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    let application = await Application.findById(applicationId).populate("job").populate("candidate");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Verify ownership
    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this status" });
    }

    application.status = status;
    await application.save();

    // Notify candidate
    await Notification.create({
      recipient: application.candidate._id,
      sender: req.user._id,
      title: `Application Status Updated`,
      message: `Your application status for "${application.job.title}" has been updated to: ${status}`,
    });

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
