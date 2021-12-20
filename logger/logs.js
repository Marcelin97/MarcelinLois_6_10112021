const winstonMongoDb= require("winston-mongodb");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf} = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logs = () => {
    return createLogger({
      level: "info",
      format: combine(
        format.colorize(),
        timestamp({ format: "HH:mm:ss" }),
        myFormat
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: "errors.log", level: "info", myFormat }),
        new transports.MongoDB({
          level: "error",
          db: process.env.MONGO_URI,
          options: {
            useUnifiedTopology: true,
          },
          collection: "Loggers",
          format: format.combine(
            format.timestamp(),
            timestamp({ format: "Date().toISOString()" }),
            format.json()
          ),
        }),
      ],
    });
};

module.exports = logs;
