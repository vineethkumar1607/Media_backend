// Separate secrets for admin-auth token and stream token (defense in depth)
const jwt = require("jsonwebtoken");

const signAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });

const verifyAuthToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const signStreamToken = (payload) => {
  const mins = parseInt(process.env.STREAM_TOKEN_EXPIRES_IN_MIN || "10", 10);
  return jwt.sign(payload, process.env.STREAM_TOKEN_SECRET, { expiresIn: `${mins}m` });
};

const verifyStreamToken = (token) => jwt.verify(token, process.env.STREAM_TOKEN_SECRET);

module.exports = { signAuthToken, verifyAuthToken, signStreamToken, verifyStreamToken };
