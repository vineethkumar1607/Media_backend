// Auth for logging views: accept EITHER a valid stream token (?token=...)
// OR an admin JWT (Authorization/Cookie)
const { verifyStreamToken } = require("../utils/jwt");
const { verifyAuthToken } = require("../utils/jwt");
const AdminUser = require("../models/adminUser");

const getBearer = (req) => {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
};

const viewAuth = async (req, res, next) => {
  // 1) Prefer short-lived stream token for real clients
  const streamToken = req.query.token;
  if (streamToken) {
    try {
      req.viewAuth = { kind: "stream", payload: verifyStreamToken(streamToken) };
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid/expired stream token" });
    }
  }

  // 2) Fallback to admin JWT (useful for testing via Postman / admin panel)
  const jwtFromHeader = getBearer(req) || req.cookies?.[process.env.COOKIE_NAME];
  if (!jwtFromHeader) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = verifyAuthToken(jwtFromHeader);
    const admin = await AdminUser.findById(payload.sub).lean();
    if (!admin) return res.status(401).json({ message: "Invalid token" });
    req.viewAuth = { kind: "admin", payload };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

module.exports = { viewAuth };
