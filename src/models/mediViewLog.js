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

// Perf indexes for analytics
MediaViewLogSchema.index({ media_id: 1, timestamp: 1 });           // time-based queries
MediaViewLogSchema.index({ media_id: 1, viewed_by_ip: 1 });        // unique IP aggregations

module.exports = model("MediaViewLog", MediaViewLogSchema);
