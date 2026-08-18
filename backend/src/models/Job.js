import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    company:     { type: String, default: "" },
    location:    { type: String, required: true },
    salary:      { type: Number },
    experience:  { type: String, default: "" },
    skillsRequired: [{ type: String }],
    jobType: {
      type: String,
      // Accepts any string; controller normalises to canonical values
      default: "Full Time",
    },
    workMode: {
      type: String,
      // "On-site" kept for backward compat; controller maps to one of these
      default: "On-site",
    },
    description: { type: String, required: true },
    deadline:    { type: Date },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Published", "Closed", "Rejected"],
      default: "Pending",
    },
    education: { type: String, default: "" },
    openings:  { type: Number, default: 1 },
    whatYouWillDo: { type: String, default: "" },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
