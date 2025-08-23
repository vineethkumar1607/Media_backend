// Consistent 404 + error responses
const notFound = (req, res, next) => next({ status: 404, message: "Route not found" });

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) req.log?.error(err);
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
