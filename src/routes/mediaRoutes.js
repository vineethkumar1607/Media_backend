const router = require("express").Router();
const { adminAuthRequired } = require("../middleware/auth");
const { viewAuth } = require("../middleware/viewAuth");
const { createMedia, getStreamUrl } = require("../controllers/mediaController");
const { logView, getAnalytics } = require("../controllers/analyticsController");
const {
  createMediaValidation,
  mediaIdParamValidation,
  viewValidation,
  analyticsQueryValidation
} = require("../validators/mediaValidators");
const { viewLimiter } = require("../middleware/rateLimit");

// Admin-only content management
router.post("/", adminAuthRequired, createMediaValidation, createMedia);
router.get("/:id/stream-url", adminAuthRequired, mediaIdParamValidation, getStreamUrl);

// View logging (accepts stream token OR admin JWT); rate-limited
router.post("/:id/view", viewLimiter, viewAuth, viewValidation, logView);

// Analytics (admin only)
router.get("/:id/analytics", adminAuthRequired, analyticsQueryValidation, getAnalytics);

module.exports = router;
