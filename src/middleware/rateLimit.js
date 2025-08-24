// Throttle the public stream endpoint
const rateLimit = require("express-rate-limit");

const streamLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});


// Limit raw view pings to avoid abuse if someone hits the endpoint directly
const viewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, 
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { streamLimiter, viewLimiter };
