const logs = require('./logs')

// load .env variables
require("dotenv").config();

let logger = null;

if (process.env.NODE_ENV !== "production") {
  logger = logs();
}

module.exports = logger;