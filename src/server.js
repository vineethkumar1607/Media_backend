// Boot entry: load env, connect DB, then start server
require("dotenv").config();
const { connectDB } = require("./config/dataBase");
const logger = require("./logger");
const app = require("./app");

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB(); // ensures we don't start without DB
  app.listen(PORT, () => {
    logger.info({ port: +PORT }, `Server listening on :${PORT}`);
  });
})();
