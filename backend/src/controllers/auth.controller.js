import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const normalizeRole = (role) => {
  if (!role) return "candidate";
  const r = role.toLowerCase().replace(/\s+/g, "");
  if (r === "jobseeker" || r === "candidate") return "candidate";
  if (r === "recruiter") return "recruiter";
  if (r === "admin") return "admin";
  return "candidate";
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    const normalizedRole = normalizeRole(role);
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
      companyName,
      verificationOTP: otp,
      verificationOTPExpires: otpExpires,
      isVerified: false,
    });

    // Send email verification OTP
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - Jobify",
      text: `Your email verification code is: ${otp}. It is valid for 10 minutes.`,
      html: `<h3>Welcome to Jobify!</h3><p>Your email verification code is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email using the OTP sent.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify user email with OTP
// @route   POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    if (
      user.verificationOTP !== otp ||
      !user.verificationOTPExpires ||
      user.verificationOTPExpires < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Email successfully verified.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: true,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend Verification OTP
// @route   POST /api/auth/resend-verification
export const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    const otp = generateOTP();
    user.verificationOTP = otp;
    user.verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - Jobify",
      text: `Your email verification code is: ${otp}. It is valid for 10 minutes.`,
      html: `<h3>Verify Your Email</h3><p>Your email verification code is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    });

    res.json({ success: true, message: "Verification OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & acquire token (handles 2FA and Ban checks)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: "Your account is banned. Please contact support." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Email is not verified. Please verify your email first." });
    }

    // Two-Factor Authentication Check
    if (user.twoFactorEnabled) {
      const otp = generateOTP();
      user.verificationOTP = otp;
      user.verificationOTPExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins for 2FA
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Two-Factor Authentication Code - Jobify",
        text: `Your 2FA login code is: ${otp}. It is valid for 5 minutes.`,
        html: `<p>Your 2FA login code is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
      });

      return res.json({
        success: true,
        twoFactorRequired: true,
        email: user.email,
        message: "Two-factor authentication code sent to email.",
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify 2FA OTP to complete login
// @route   POST /api/auth/verify-2fa
export const verify2FA = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: "Your account is banned." });
    }

    if (
      user.verificationOTP !== otp ||
      !user.verificationOTPExpires ||
      user.verificationOTPExpires < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired 2FA OTP" });
    }

    // Clear 2FA OTP
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Login
// @route   POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { googleId, email, name, photo, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      if (user.isBanned) {
        return res.status(403).json({ success: false, message: "Your account is banned." });
      }
      // Link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Auto-verify on Google login
        if (photo && !user.photo) user.photo = photo;
        await user.save();
      }
    } else {
      // Create new user
      const randomPassword = Math.random().toString(36).substring(2, 10); // Dummy password
      user = await User.create({
        name,
        email,
        password: randomPassword,
        googleId,
        role: normalizeRole(role),
        photo: photo || "",
        isVerified: true, // Google accounts are pre-verified
      });
    }

    // Handle 2FA for Google Login if enabled
    if (user.twoFactorEnabled) {
      const otp = generateOTP();
      user.verificationOTP = otp;
      user.verificationOTPExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Two-Factor Authentication Code - Jobify",
        text: `Your 2FA login code is: ${otp}. It is valid for 5 minutes.`,
        html: `<p>Your 2FA login code is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
      });

      return res.json({
        success: true,
        twoFactorRequired: true,
        email: user.email,
        message: "Two-factor authentication code sent to email.",
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - Jobify",
      text: `Your password reset code is: ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your password reset code is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    });

    res.json({ success: true, message: "Password reset OTP sent to email." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (
      user.resetPasswordOTP !== otp ||
      !user.resetPasswordOTPExpires ||
      user.resetPasswordOTPExpires < new Date()
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Two-Factor Authentication
// @route   POST /api/auth/2fa/toggle
// @access  Private
export const toggle2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.twoFactorEnabled = !user.twoFactorEnabled;
    if (user.twoFactorEnabled) {
      // Mock generate 2FA Secret
      user.twoFactorSecret = `secret_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    } else {
      user.twoFactorSecret = undefined;
    }

    await user.save();

    res.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled,
      secret: user.twoFactorSecret,
      message: `2FA ${user.twoFactorEnabled ? "enabled" : "disabled"} successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
