const router = require("express").Router();
const { adminAuthRequired } = require("../middleware/auth");
const { createMedia, getStreamUrl } = require("../controllers/mediaController");
const { createMediaValidation, mediaIdParamValidation } = require("../validators/mediaValidators");

// Authenticated admin-only routes
router.post("/", adminAuthRequired, createMediaValidation, createMedia);
router.get("/:id/stream-url", adminAuthRequired, mediaIdParamValidation, getStreamUrl);

module.exports = router;
