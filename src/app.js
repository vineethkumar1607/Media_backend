// Express app wiring: security, parsers, logging, routes, errors
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pinoHttp = require("pino-http");
const logger = require("./logger");

const { notFound, errorHandler } = require("./middleware/error");
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const streamRoutes = require("./routes/streamRoutes");

const app = express();

app.use(helmet()); // secure headers
app.use(cors({ origin: true, credentials: true })); // allow cookies in CORS
app.use(express.json({ limit: "1mb" })); // parse JSON bodies
app.use(cookieParser()); // read httpOnly cookies
app.use(pinoHttp({ logger })); // request logs

// health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/stream", streamRoutes); // public (token-validated) stream endpoint

// 404 + centralized errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
