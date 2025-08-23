
// pino logger (pretty in dev)
const pino = require("pino");

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" }
});

module.exports = logger;
