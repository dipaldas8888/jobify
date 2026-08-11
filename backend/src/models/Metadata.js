import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Category", "Skill", "Company"],
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    // Specific fields for Company
    website: { type: String },
    logo: { type: String },
    location: { type: String },
    isApproved: { type: Boolean, default: false }, // For company approval
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Ensure uniqueness per type
metadataSchema.index({ type: 1, name: 1 }, { unique: true });

export default mongoose.model("Metadata", metadataSchema);
