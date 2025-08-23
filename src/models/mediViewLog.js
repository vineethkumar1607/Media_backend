// Analytics: record every successful stream token usage
const { Schema, model, Types } = require("mongoose");

const MediaViewLogSchema = new Schema(
  {
    media_id: { type: Types.ObjectId, ref: "MediaAsset", required: true, index: true },
    viewed_by_ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

module.exports = model("MediaViewLog", MediaViewLogSchema);
