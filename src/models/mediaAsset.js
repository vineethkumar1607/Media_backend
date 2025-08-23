// Media metadata only (not the actual file)
const { Schema, model } = require("mongoose");

const MediaAssetSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["video", "audio"], required: true },
    file_url: { type: String, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false }, versionKey: false }
);

module.exports = model("MediaAsset", MediaAssetSchema);
