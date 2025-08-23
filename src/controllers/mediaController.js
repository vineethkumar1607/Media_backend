// Create media + generate 10-min stream URL (admin-only)
const { validationResult } = require("express-validator");
const MediaAsset = require("../models/mediaAsset");
const { signStreamToken } = require("../utils/jwt");

exports.createMedia = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, type, file_url } = req.body;
    const media = await MediaAsset.create({ title, type, file_url });

    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
};

exports.getStreamUrl = async (req, res, next) => {
  try {
    const mediaId = req.params.id;
    const media = await MediaAsset.findById(mediaId);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const token = signStreamToken({ mid: media._id.toString() });
    const base = process.env.BASE_URL?.replace(/\/$/, "") || `http://localhost:${process.env.PORT || 4000}`;
    const url = `${base}/api/stream?token=${token}`;
    const expires = parseInt(process.env.STREAM_TOKEN_EXPIRES_IN_MIN || "10", 10);

    res.json({ url, expires_in_minutes: expires });
  } catch (err) {
    next(err);
  }
};
