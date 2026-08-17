import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure local uploads directory exists
const uploadDir = path.resolve("uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    const userId = req.user ? (req.user._id || req.user.id) : "user";
    const uniqueName = `resume-${userId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadResume = multer({
  storage: diskStorage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

// CSV upload — stored in memory (parsed immediately, not saved to disk)
export const uploadCsv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".csv" || file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed for bulk import"));
    }
  },
});
