import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    experience: { type: String }, // e.g. "2+ years" or "0-1 years"
    skillsRequired: [{ type: String }],
    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "Contract", "Internship", "Fresher", "Full-time", "Part-time"],
      default: "Full Time",
    },
    workMode: { 
      type: String, 
      enum: ["Remote", "Hybrid", "Onsite"],
      default: "Onsite"
    },
    description: { type: String, required: true },
    deadline: { type: Date }, // Expiry date
    status: {
      type: String,
      enum: ["Draft", "Pending", "Published", "Closed", "Rejected"],
      default: "Pending",
    },
    education: { type: String }, // e.g. "Bachelor's Degree", "Master's"
    openings: { type: Number, default: 1 },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
