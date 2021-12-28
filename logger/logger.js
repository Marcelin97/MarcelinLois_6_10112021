// const logs = require('./logs')

//logger.js
const bunyan = require('bunyan');

//create the logger using createLogger method
const logger = bunyan.createLogger({
  name: "bunyan-log",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "debug",
      stream: process.stderr, // log INFO and above to stdout
    },
    {
      stream: process.stderr,
      level: "error",
    },
    {
      type: "rotating-file",
      path: __dirname + "AppError.log", // log ERROR and above to a file
      period: "1d", // daily rotation
      count: 3, // keep 3 back copies
      totalFiles: 10, // keep 10 back copies
      rotateExisting: true, // Give ourselves a clean file when we start up, based on period
      gzip: true, // Compress the archive log files to save space
    },
  ],
});

// logger.info("This is logging");

module.exports = logger;