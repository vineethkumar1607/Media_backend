const { body } = require("express-validator");

// Only admins exist in this system (as per spec).
const signupValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isString().isLength({ min: 6 }).withMessage("Password >= 6 chars")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isString().withMessage("Password required")
];

module.exports = { signupValidation, loginValidation };
