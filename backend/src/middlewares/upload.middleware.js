import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-portal/resumes",
    // 'auto' or 'raw' is often required for non-image files like PDFs in Cloudinary
    resource_type: "auto",
    allowed_formats: ["pdf"],
    public_id: (req, file) => `${req.user._id}-${Date.now()}`,
  },
});

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
});
