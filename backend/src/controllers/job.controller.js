import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import { parse } from "csv-parse/sync";

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
      status: req.user.role === "admin" ? (status || "Published") : "Pending",
      education,
      openings: openings || 1,
      recruiter: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json({
      success: true,
      message: req.user.role === "admin" ? "Job created and published live." : "Job submitted successfully! It is pending admin approval before appearing live.",
      data: createdJob
    });
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

    let finalResumePath = req.file ? req.file.path : (resumeUrl || req.user.resume || "uploads/resumes/default_resume.pdf");
    finalResumePath = finalResumePath.replace(/\\/g, "/");
    if (finalResumePath.includes("uploads/")) {
      finalResumePath = "uploads/" + finalResumePath.split("uploads/")[1];
    }


    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl: finalResumePath,
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

// ==========================================
// Bulk Create Jobs via CSV Upload
// ==========================================

/**
 * Normalize a CSV header to a canonical slug for matching.
 * "Job Title", "job_title", "JOBTITLE", "Job Title *" → "jobtitle"
 */
const normalizeHeader = (h) =>
  h.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Alias map: canonical field → exact normalized header variants.
 * ALL matches are exact (norm === alias) — no startsWith to avoid false positives.
 * Add any new header variant you encounter as a new alias entry.
 */
const FIELD_ALIASES = {
  title: [
    "title", "jobtitle", "positiontitle", "position", "role", "jobrole",
    "jobposition", "joblisting", "jobopeningtitle", "vacancy",
  ],
  company: [
    "company", "companyname", "employer", "organization", "organisation",
    "firm", "recruitingcompany", "hiringcompany", "businessname",
  ],
  location: [
    "location", "joblocation", "city", "place", "worklocation", "region",
    "officelocation", "workcity", "jobcity", "area",
  ],
  description: [
    "description", "jobdescription", "jobdetails", "details", "overview",
    "about", "summary", "jobsummary", "aboutthejob", "roledescription",
    "joboverview", "positiondescription",
  ],
  salary: [
    "salary", "annualsalary", "pay", "compensation", "ctc", "package",
    "salarylpa", "salaryrange", "annualsalary", "expectedsalary",
    "annualsalary", "salaryinr", "ctcpa",
    // handles "Annual Salary ($)" → "annualsalary"
    "annualsalary",
  ],
  experience: [
    "experience", "experiencelevel", "exp", "seniority", "level",
    "joblevel", "yearsofexperience", "requiredexperience", "experiencerequired",
    "experienceyears", "senioritylevel",
  ],
  jobType: [
    "jobtype", "type", "employmenttype", "contracttype", "worktype",
    "jobtypefullparttime", "employmentmode",
  ],
  workMode: [
    "workmode", "mode", "workarrangement", "remoteoronsite",
    "workstyle", "workformat", "officeremote",
  ],
  skillsRequired: [
    "skillsrequired", "skills", "requiredskills", "techstack", "technologies",
    "keyskills",
    "requiredskillscommaseparated",   // "Required Skills (comma separated)"
    "requiredskilscommaseparated",    // typo variant with one l
    "requiredskilscommasepar",
    "requiredskilscommasepara",
    "requiredskillscommasepara",
    "skillscommaseparated",
    "requiredskillscommasep",
  ],

  education: [
    "education", "qualification", "degree", "educationrequired",
    "minimumeducation", "educationlevel",
  ],
  openings: [
    "openings", "vacancies", "seats", "noofpositions", "positions",
    "headcount", "numberofpositions", "numberofvacancies",
  ],
  deadline: [
    "deadline", "applicationdeadline", "closingdate", "lastdate",
    "applyby", "applicationclosedate", "lastdatetoapply",
  ],
  status: ["status", "jobstatus", "publishstatus"],
};

/**
 * Build a lookup: rawHeader → canonicalField
 * Uses EXACT match on the normalized header only.
 */
const buildHeaderMap = (rawHeaders) => {
  const map = {};
  rawHeaders.forEach((raw) => {
    const norm = normalizeHeader(raw);
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      // Exact match only — prevents "jobdescription" matching "job" alias for title
      if (aliases.includes(norm)) {
        map[raw] = field;
        break;
      }
    }
    // Fallback: if still unmatched, try prefix match only when alias is LONGER than 5 chars
    // This handles typos/truncated headers safely
    if (!map[raw]) {
      for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
        const matched = aliases.find(
          (a) => a.length > 5 && (norm.startsWith(a) || a.startsWith(norm))
        );
        if (matched) {
          map[raw] = field;
          break;
        }
      }
    }
  });
  return map;
};


/**
 * Normalize a row using the header map so all fields use canonical names.
 */
const normalizeRow = (rawRow, headerMap) => {
  const norm = {};
  for (const [rawKey, value] of Object.entries(rawRow)) {
    const canonical = headerMap[rawKey];
    if (canonical) {
      norm[canonical] = value;
    }
  }
  return norm;
};

// @desc    Bulk create jobs from CSV file
// @route   POST /api/jobs/bulk-import
// @access  Private (Recruiter/Admin)
export const bulkCreateJobs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No CSV file uploaded" });
    }

    const csvText = req.file.buffer.toString("utf-8");

    // Parse CSV — first row is headers
    let records;
    try {
      records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        relax_quotes: true,
        relax_column_count: true,
      });
    } catch (parseErr) {
      return res.status(400).json({
        success: false,
        message: `CSV parse error: ${parseErr.message}`,
      });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({ success: false, message: "CSV file is empty or has no valid rows" });
    }

    // Build header → canonical field map
    const rawHeaders = Object.keys(records[0]);
    const headerMap = buildHeaderMap(rawHeaders);

    // Normalize all records using the header map
    const normalizedRecords = records.map((r) => normalizeRow(r, headerMap));

    const REQUIRED_FIELDS = ["title", "location", "description"];
    const errors = [];
    const imported = [];

    // ── Insert each row individually so one bad row never blocks others ──
    for (let idx = 0; idx < normalizedRecords.length; idx++) {
      const row = normalizedRecords[idx];
      const rowNum = idx + 2; // account for 1-indexing + header row

      // Only skip rows missing the 3 truly required fields
      const missing = REQUIRED_FIELDS.filter((f) => !row[f] || !String(row[f]).trim());
      if (missing.length > 0) {
        errors.push(`Row ${rowNum} skipped — missing required field(s): ${missing.join(", ")}`);
        continue;
      }

      // ── Optional field parsing — always produce a safe value, never throw ──

      // Skills: comma-separated string → array; any garbage becomes []
      let skillsArray = [];
      try {
        skillsArray = String(row.skillsRequired || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } catch (_) { /* stay empty */ }

      // Salary: strip currency chars; NaN → undefined (field omitted)
      let salary;
      try {
        const n = parseFloat(String(row.salary || "").replace(/[^0-9.]/g, ""));
        if (!isNaN(n) && n > 0) salary = n;
      } catch (_) { /* stay undefined */ }

      // Experience: fuzzy map common strings; anything unrecognised stored as-is
      const expRaw = String(row.experience || "").toLowerCase();
      let experience = "";
      if (expRaw.includes("entry") || expRaw.includes("junior") || expRaw.includes("fresher")) {
        experience = "Entry Level";
      } else if (expRaw.includes("senior") || expRaw.includes("lead") || expRaw.includes("principal")) {
        experience = "Senior Level";
      } else if (expRaw.includes("intern")) {
        experience = "Internship";
      } else if (expRaw.includes("mid") || expRaw.includes("intermediate")) {
        experience = "Mid Level";
      } else {
        experience = row.experience ? String(row.experience).trim() : "";
      }

      // Job type: normalise; unknown values stored as-is
      const typeRaw = String(row.jobType || "").toLowerCase();
      let jobType = "Full Time";
      if (typeRaw.includes("part")) jobType = "Part Time";
      else if (typeRaw.includes("contract") || typeRaw.includes("freelance")) jobType = "Contract";
      else if (typeRaw.includes("intern")) jobType = "Internship";
      else if (row.jobType) jobType = String(row.jobType).trim();

      // Work mode: normalise; unknown values stored as-is
      const modeRaw = String(row.workMode || "").toLowerCase();
      let workMode = "On-site";
      if (modeRaw.includes("remote")) workMode = "Remote";
      else if (modeRaw.includes("hybrid")) workMode = "Hybrid";
      else if (row.workMode) workMode = String(row.workMode).trim();

      // Openings: must be a positive integer; default 1
      let openings = 1;
      try {
        const n = parseInt(row.openings);
        if (!isNaN(n) && n > 0) openings = n;
      } catch (_) { /* default 1 */ }

      // Deadline: parse date; invalid date → omitted
      let deadline;
      try {
        if (row.deadline) {
          const d = new Date(row.deadline);
          if (!isNaN(d.getTime())) deadline = d;
        }
      } catch (_) { /* omit */ }

      // Build the job document — all optional fields have safe fallbacks
      const jobDoc = {
        title:         String(row.title).trim(),
        company:       String(row.company || "").trim(),
        location:      String(row.location).trim(),
        description:   String(row.description).trim(),
        experience:    experience,
        jobType:       jobType,
        workMode:      workMode,
        skillsRequired: skillsArray,
        education:     String(row.education || "").trim(),
        openings:      openings,
        status:        req.user.role === "admin"
                         ? (row.status || "Published")
                         : "Pending",
        recruiter:     req.user._id,
        ...(salary !== undefined && { salary }),
        ...(deadline  !== undefined && { deadline }),
      };

      // Insert individually so validation errors on one row don't abort others
      try {
        const saved = await Job.create(jobDoc);
        imported.push(saved);
      } catch (insertErr) {
        // Mongoose validation error — record it but carry on
        const msg = insertErr?.message || String(insertErr);
        errors.push(`Row ${rowNum} ("${jobDoc.title}"): ${msg}`);
      }
    }

    // ── Respond even if some rows failed ──
    const statusCode = imported.length > 0 ? 201 : 400;
    return res.status(statusCode).json({
      success: imported.length > 0,
      message: imported.length > 0
        ? `Successfully imported ${imported.length} job(s).${errors.length > 0 ? ` ${errors.length} row(s) had issues.` : ""}`
        : "No jobs were imported. All rows had errors.",
      imported: imported.length,
      skipped:  errors.length,
      errors:   errors.length > 0 ? errors : undefined,
      detectedHeaders: rawHeaders,
      headerMapping:   headerMap,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

