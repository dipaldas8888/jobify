import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    googleId: { type: String },
    isBanned: { type: Boolean, default: false },

    // Verification & Security
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationOTPExpires: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    twoFactorTempSecret: { type: String },

    // Profile - Personal Info
    photo: { type: String, default: "" },
    about: { type: String, default: "" },
    location: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    expectedSalary: { type: String, default: "" },
    preferredLocation: { type: String, default: "" },
    noticePeriod: { type: String, default: "" },

    // Profile - Skills
    skills: [
      {
        skillName: { type: String, required: true },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Expert"],
          default: "Beginner",
        },
        yearsOfExperience: { type: Number, default: 0 },
      },
    ],

    // Profile - Education
    education: [
      {
        college: { type: String, required: true },
        degree: { type: String, required: true },
        cgpa: { type: Number },
        year: { type: Number },
      },
    ],

    // Profile - Experience
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        duration: { type: String }, // e.g. "2 years" or "Jan 2020 - Feb 2022"
        responsibilities: { type: String },
      },
    ],

    // Profile - Certifications
    certifications: [
      {
        name: { type: String, required: true },
        organization: { type: String },
        url: { type: String },
      },
    ],

    // Profile - Languages
    languages: [{ type: String }],

    // Profile - Resume
    resume: { type: String }, // URL of current PDF
    resumeVersionHistory: [
      {
        url: { type: String, required: true },
        versionName: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Candidate Saved Jobs
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // Recruiter Specific fields
    companyName: { type: String },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
