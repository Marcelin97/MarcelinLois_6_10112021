//=================================>
/////////////////// Connect MongoDB
//=================================>
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Lois:DEVweb2021@apisecuriseep6.ynmqf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = mongoose;
//=================================>
/////////////////// Connect MongoDB
//=================================>
