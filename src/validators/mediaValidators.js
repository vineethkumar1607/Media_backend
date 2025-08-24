const { param, body, query } = require("express-validator");
const mongoose = require("mongoose");

const isObjectId = (value) => mongoose.isValidObjectId(value);

const createMediaValidation = [
  body("title").isString().trim().isLength({ min: 1, max: 300 }),
  body("type").isIn(["video", "audio"]),
  body("file_url").isURL()
];

const mediaIdParamValidation = [param("id").custom(isObjectId)];

const viewValidation = [
  param("id").custom(isObjectId),
  // no body fields needed; timestamp is server-side; token is query (?token=) if used
];

const analyticsQueryValidation = [
  param("id").custom(isObjectId),
  query("from").optional().isISO8601().toDate().withMessage("from must be YYYY-MM-DD"),
  query("to").optional().isISO8601().toDate().withMessage("to must be YYYY-MM-DD")
];

module.exports = {
  createMediaValidation,
  mediaIdParamValidation,
  viewValidation,
  analyticsQueryValidation
};
