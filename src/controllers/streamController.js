// Public endpoint that validates short-lived stream token,
// logs a view, then redirects to actual file_url.
const { verifyStreamToken } = require("../utils/jwt");
const MediaAsset = require("../models/mediaAsset");
const MediaViewLog = require("../models/mediViewLog");

exports.stream = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ message: "Missing token" });

    let payload;
    try {
      payload = verifyStreamToken(token);
    } catch {
      return res.status(401).json({ message: "Invalid/expired stream token" });
    }

    const media = await MediaAsset.findById(payload.mid);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // log viewer IP
    const ip =
      (req.headers["x-forwarded-for"]?.toString().split(",")[0] || "").trim() ||
      req.socket.remoteAddress ||
      "unknown";

    await MediaViewLog.create({ media_id: media._id, viewed_by_ip: ip });

    // In real production, generate a pre-signed CDN/S3 URL here.
    return res.redirect(302, media.file_url);
  } catch (err) {
    next(err);
  }
};
