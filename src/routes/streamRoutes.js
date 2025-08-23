const router = require("express").Router();
const { streamLimiter } = require("../middleware/rateLimit");
const { stream } = require("../controllers/streamController");

// Public endpoint: validate token, log, redirect
router.get("/", streamLimiter, stream);

module.exports = router;
