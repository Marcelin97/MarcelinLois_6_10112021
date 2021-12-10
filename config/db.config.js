require("dotenv").config();
const bunyan = require("bunyan");

var log = bunyan.createLogger({
  name: "MongoDB Driver",
  streams: [
    {
      stream: process.stdout,
      level: "info",
    },
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      stream: process.stderr,
      level: "error",
    },
  ],
});

function mongoLogger(msg, state) {
  //console.log(msg, state);

  switch (state.type) {
    case "debug":
      log.debug(state);
      break;
    case "info":
      log.info(state);
      break;
    case "warn":
      log.warn(state);
    case "error":
    default:
      log.error(state);
  }
}

var options = {
  logger: mongoLogger,
  loggerLevel: "info",
};
//=================================>
/////////////////// Connect MongoDB
//=================================>
const mongoose = require("mongoose");

//If the URI is nof found in .env config
if (!process.env.MONGO_URI) {
  console.log("No DB_URI found in .env configuration");
}

mongoose
  .connect(process.env.MONGO_URI, options, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = mongoose;
//=================================>
/////////////////// Connect MongoDB
//=================================>
