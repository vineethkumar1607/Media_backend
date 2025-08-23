// Auth guard: checks bearer token OR httpOnly cookie; attaches req.admin
const { verifyAuthToken } = require("../utils/jwt");
const AdminUser = require("../models/adminUser");

const getTokenFromReq = (req) => {
  // Prefer Authorization: Bearer <token>
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  // Fallback to httpOnly cookie
  return req.cookies?.[process.env.COOKIE_NAME];
};

const adminAuthRequired = async (req, res, next) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = verifyAuthToken(token);
    const admin = await AdminUser.findById(payload.sub).lean();
    if (!admin) return res.status(401).json({ message: "Invalid token" });

    req.admin = { id: admin._id.toString(), email: admin.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

module.exports = { adminAuthRequired };
