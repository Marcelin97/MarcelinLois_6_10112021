// On a besoin d'express. On importe express dans une constante
const express = require("express");

// On importe bodyParser pour transformer le corp de la requête en JSON, en objet JS utilisable
const bodyParser = require("body-parser");

// Envoi le contenu du fichier .env dans l'object process.env
require("dotenv").config();

// j'importe ma BDD
require("./config/db.config");

// Accéder au path de notre serveur
const path = require("path");

// Protecting against the NoSQL injection
const mongoSanitize = require("express-mongo-sanitize");

// J'importe mes routes qui sont mtn dans mon index.js
const router = require("./app/routes/index");

// On crée une constante app qui est notre application. 
// On appel la méthode express ce qui permet de crée une application express
const app = express();

//=================================>
/////////////////// Middleware CORS
//=================================>
const cors = require("cors");
app.use(
  cors({
    // CORS n’accepte qu’un seul client, qui est l’application Frontend
    origin: process.env.CLIENT_ENDPOINT,
  })
);
//=================================>
//////////////// End Middleware CORS
//=================================>

// Exportons notre variable d'application afin qu'elle puisse être importée et utilisée dans d'autres fichiers.
// Notamment depuis notre serveur node.
module.exports = app;

//=================================>
///////////////// Limit payload size
//=================================>

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//=================================>
///////////// End Limit payload size
//=================================>

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); 

// On applique nos routes à notre app.
app.use("/api", router);

// Serve static files
app.use("/images/", express.static(path.join(__dirname, "images")));


// //=================================>
// ////////////////// Start application
// //=================================>
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log("server is listening on port" + " " + PORT + " " + "...");
// });
// //=================================>
// ////////////// End Start application
// //=================================>

//=================================>
///////// Express Session Middleware
//=================================>
const session = require("express-session");

// paramètre les cookies en HTTP-only pour qu'ils ne puissent pas être modifié par un tiers
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "keyboard cat", // secret string used in the signing of the session ID that is stored in the cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      // Les attaques cross-site scripting ou XSS
      secure: true, // only send cookie over https
      httponly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
      domain: "http://localhost:3000",
      maxAge: 60000 * 60 * 24, // set cookie expiry length in ms
    },
  })
);
//=================================>
///// End Express Session Middleware
//=================================>

//=================================>
// x - xss - protection
// Set some secure headers with helmet.js
//=================================>
// module that helps secure your applications by setting various HTTP headers.
const helmet = require("helmet");
app.use(helmet());
//=================================>
// End - x - xss - protection
// Set some secure headers with helmet.js
//=================================>