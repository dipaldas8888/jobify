import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

// Serve uploaded files statically (resumes, avatars, company logos)
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;
