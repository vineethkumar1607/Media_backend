// Throttle the public stream endpoint
const rateLimit = require("express-rate-limit");

const streamLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { streamLimiter };
