const router = require("express").Router();
const { signup, login, logout } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../validators/authValidators");

// Admin signup + login + logout
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

module.exports = router;
