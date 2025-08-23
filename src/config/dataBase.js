// MongoDB Atlas connection
const mongoose = require("mongoose");
const logger = require("../logger");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  logger.info("MongoDB connected");
};

module.exports = { connectDB };
