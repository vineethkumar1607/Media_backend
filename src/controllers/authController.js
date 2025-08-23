// Admin authentication controller: handles signup, login, logout
// Uses JWT for authentication and HttpOnly cookies for secure session storage

const { validationResult } = require("express-validator");
const AdminUser = require("../models/adminUser");
const { hashPassword, verifyPassword } = require("../utils/password"); // bcrypt utils
const { signAuthToken } = require("../utils/jwt"); // JWT helper

/**
 * Sets authentication cookie in the response.
 * - httpOnly: prevents JavaScript access (mitigates XSS)
 * - secure: only over HTTPS in production
 * - sameSite=lax: reduces CSRF risk but still allows basic navigation
 * - maxAge: configurable via environment
 */
const setAuthCookie = (res, token) => {
  const days = parseInt(process.env.COOKIE_EXPIRES_DAYS || "1", 10);
  res.cookie(process.env.COOKIE_NAME || "access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: days * 24 * 60 * 60 * 1000 
  });
};

/**
 * @desc Admin signup
 * @route POST /api/admin/signup
 * @access Public
 */
exports.signup = async (req, res, next) => {
  try {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    // Checks if user already exists
    const exists = await AdminUser.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // Hashes the password before saving 
    const hashed_password = await hashPassword(password);

    // Creates admin user in DB
    const admin = await AdminUser.create({ email, hashed_password });

    // Generates JWT (contains user id, email, and role)
    const token = signAuthToken({ sub: admin._id.toString(), email: admin.email, role: "admin" });

    // Store token securely in HttpOnly cookie
    setAuthCookie(res, token);

    // Respond with safe admin data 
    res.status(201).json({
      message: "Signup successful",
      admin: { id: admin._id, email: admin.email }
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc Admin login
 * @route POST /api/admin/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    // Check if user exists
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // Verify password with bcrypt
    const ok = await verifyPassword(password, admin.hashed_password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Sign new JWT token
    const token = signAuthToken({ sub: admin._id.toString(), email: admin.email, role: "admin" });

    // Store token in HttpOnly cookie
    setAuthCookie(res, token);

    // Respond with safe user info
    res.json({
      message: "Login successful",
      admin: { id: admin._id, email: admin.email }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Admin logout
 * @route POST /api/admin/logout
 * @access Private
 */
exports.logout = async (req, res) => {
  // Clear the auth cookie (removes session)
  res.clearCookie(process.env.COOKIE_NAME || "access_token");
  res.json({ message: "Logged out" });
};
