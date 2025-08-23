// Bcrypt helpers for hashing & verifying passwords
const bcrypt = require("bcryptjs");

const hashPassword = async (plainText) => bcrypt.hash(plainText, 12);
const verifyPassword = async (plainText, hashed) => bcrypt.compare(plainText, hashed);

module.exports = { hashPassword, verifyPassword };
