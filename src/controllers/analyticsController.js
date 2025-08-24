// View logging + analytics aggregation
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const MediaAsset = require("../models/mediaAsset");
const MediaViewLog = require("../models/mediViewLog");

// POST /api/media/:id/view
// Accepts either stream token (?token=) or admin JWT (via viewAuth middleware).
// Logs viewer IP with server-side timestamp (client cannot spoof).
exports.logView = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;

    // Ensure media exists
    const media = await MediaAsset.findById(id).lean();
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Extract real IP as best as we can (works behind proxies/CDNs)
    const ip =
      (req.headers["x-forwarded-for"]?.toString().split(",")[0] || "").trim() ||
      req.socket.remoteAddress ||
      "unknown";

    // Always use server timestamp for integrity (ignore client-sent timestamp)
    await MediaViewLog.create({ media_id: media._id, viewed_by_ip: ip });

    res.status(201).json({ message: "View logged", media_id: media._id, ip });
  } catch (err) {
    next(err);
  }
};

// GET /api/media/:id/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
// Admin-only (via adminAuthRequired). Aggregates:
// - total_views
// - unique_ips
// - views_per_day: { "2025-08-01": 34, ... }
exports.getAnalytics = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const media = await MediaAsset.findById(id).lean();
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Optional date range
    const match = { media_id: new mongoose.Types.ObjectId(id) };
    const { from, to } = req.query;

    if (from) match.timestamp = { ...(match.timestamp || {}), $gte: new Date(`${from}T00:00:00.000Z`) };
    if (to)   match.timestamp = { ...(match.timestamp || {}), $lte: new Date(`${to}T23:59:59.999Z`) };

    const [result] = await MediaViewLog.aggregate([
      { $match: match },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                total_views: { $sum: 1 },
                unique_ips_set: { $addToSet: "$viewed_by_ip" }
              }
            },
            {
              $project: {
                _id: 0,
                total_views: 1,
                unique_ips: { $size: "$unique_ips_set" }
              }
            }
          ],
          perDay: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      },
      {
        $project: {
          total_views: { $ifNull: [{ $arrayElemAt: ["$totals.total_views", 0] }, 0] },
          unique_ips: { $ifNull: [{ $arrayElemAt: ["$totals.unique_ips", 0] }, 0] },
          views_per_day: {
            $arrayToObject: {
              $map: {
                input: "$perDay",
                as: "d",
                in: { k: "$$d._id", v: "$$d.count" }
              }
            }
          }
        }
      }
    ]);

    res.json(result || { total_views: 0, unique_ips: 0, views_per_day: {} });
  } catch (err) {
    next(err);
  }
};
