// Admin-only account (as per spec)
// Password is stored as hashed_password (bcrypt). No plain passwords.
const { Schema, model } = require("mongoose");

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    hashed_password: { type: String, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false }, versionKey: false }
);

module.exports = model("AdminUser", AdminUserSchema);
  