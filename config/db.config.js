// load .env variables
require("dotenv").config();

//path to my logger 
const logger = require('../logger/logger'); 

//=================================>
/////////////////// Connect MongoDB
//=================================>
const mongoose = require("mongoose");

//If the URI is nof found in .env config
if (!process.env.MONGO_URI) {
  console.log("No DB_URI found in .env configuration");
}
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.debug("Connexion à MongoDB réussie !"))
  .catch(() => logger.error("Connexion à MongoDB échouée !"));

module.exports = mongoose;
//=================================>
/////////////////// Connect MongoDB
//=================================>
