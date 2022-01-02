//on a besoin d'express. On importe express dans une constante
const express = require("express");

//on importe bodyParser pour transformer le corp de la requête en JSON, en objet JS utilisable
const bodyParser = require("body-parser");

//j'importe ma BDD qui est dans le fichier db.config.js
const mongoose = require("./config/db.config");

<<<<<<< Updated upstream
//on crée une constante app qui est notre application. 
//On appel la méthode express ce qui permet de crée une application express
=======
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
// deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>, deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>
>>>>>>> Stashed changes
const app = express();

//on importe nos routes
// const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./app/routes/user");
const sauceRoutes = require("./app/routes/sauce");

//=================================>
/////////////////// middleware CORS
//=================================>
<<<<<<< Updated upstream
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
=======

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

>>>>>>> Stashed changes
//=================================>
/////////////////// middleware CORS
//=================================>

<<<<<<< Updated upstream
//On importe toute la logique de nos routes. 
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes );

//On exporte notre application pour y avoir accès depuis n'importe qu'elle fichier. 
//Notamment depuis notre serveur node.
module.exports = app;

//Nous devrons être capables d'extraire l'objet JSON de la demande. Il nous faudra le package body-parser
//avant les routes de l'application, on utilise app.use comme middleware global
//on utilise une méthode .json qui va transformer notre requête en objet JSON.
app.use(bodyParser.json());

// //paramètre les cookies en HTTP-only pour qu'ils ne puissents pas être modfié par un tiers
// app.use(session({
//   secret: "s3cur3"
//   cookie: {
//     secure: true,
//     httponly: true,
//     domain: 'http://localhost:3000'
//   }
// }));
=======
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
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SECRETE_SESSION, // secret string used in the signing of the session ID that is stored in the cookie
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
>>>>>>> Stashed changes
