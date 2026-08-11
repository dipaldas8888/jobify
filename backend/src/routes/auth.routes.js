import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerificationOTP,
  loginUser,
  verify2FA,
  googleLogin,
  forgotPassword,
  resetPassword,
  toggle2FA,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verify2FASchema,
} from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/verify-email", validateRequest(verifyEmailSchema), verifyEmail);
router.post("/resend-verification", resendVerificationOTP);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/verify-2fa", validateRequest(verify2FASchema), verify2FA);
router.post("/google", validateRequest(googleLoginSchema), googleLogin);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);

// Private Routes
router.post("/2fa/toggle", protect, toggle2FA);

export default router;
