//on a besoin d'express. On importe express dans une constante
const express = require("express");

//on importe bodyParser pour transformer le corp de la requête en JSON, en objet JS utilisable
const bodyParser = require("body-parser");

//Envoi le contenu du fichier .env dans l'object process.env
require("dotenv").config();

//j'importe ma BDD qui est dans le fichier db.config.js
require("./config/db.config");

const path = require("path");

//j'importe mes routes qui sont mtn dans mon index.js
const router = require("./app/routes/index");

//on crée une constante app qui est notre application. 
//On appel la méthode express ce qui permet de crée une application express
const app = express();

//=================================>
/////////////////// middleware CORS
//=================================>
const cors = require("cors");
app.use(cors());
//=================================>
/////////////////// middleware CORS
//=================================>

//exportons notre variable d'application afin qu'elle puisse être importée et utilisée dans d'autres fichiers.
//Notamment depuis notre serveur node.
module.exports = app;

//Nous devrons être capables d'extraire l'objet JSON de la demande. Il nous faudra le package body-parser
//avant les routes de l'application, on utilise app.use comme middleware global
//on utilise une méthode .json qui va transformer notre requête en objet JSON.
app.use(bodyParser.json());

//on récupère nos routes qui est l'index.js, appelé router.
app.use("/api", router);

// Serve static files
app.use("/images/", express.static(path.join(__dirname, "images")));

//=================================>
////////////////// Start application
//=================================>
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server is listening on port" + " " + PORT + " " + "...");
});
//=================================>
////////////////// Start application
//=================================>

//=================================>
///////// Express Session Middleware
//=================================>
const session = require("express-session");

//paramètre les cookies en HTTP-only pour qu'ils ne puissent pas être modifié par un tiers
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "s3cur3",
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
    cookie: {
      //Les attaques cross-site scripting ou XSS
      secure: true,
      httponly: true,
      domain: "http://localhost:3000",
      // expires: expiryDate,
    },
  })
);
//=================================>
///////// Express Session Middleware
//=================================>

//=================================>
//Set some secure headers with helmet.js
//=================================>
//module that helps secure your applications by setting various HTTP headers.
const helmet = require("helmet");
app.use(helmet());
//=================================>
//Set some secure headers with helmet.js
//=================================>