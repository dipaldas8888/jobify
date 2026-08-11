import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: { type: String, required: true }, // Link to uploaded PDF
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview Scheduled", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true },
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
