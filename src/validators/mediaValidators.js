const { body, param } = require("express-validator");

const createMediaValidation = [
  body("title").trim().isLength({ min: 1 }).withMessage("title required"),
  body("type").isIn(["video", "audio"]).withMessage("type must be video|audio"),
  body("file_url").isURL().withMessage("file_url must be a valid URL")
];

const mediaIdParamValidation = [
  param("id").isMongoId().withMessage("Invalid media id")
];

module.exports = { createMediaValidation, mediaIdParamValidation };
