//on a besoin d'express. On importe express dans une constante
const express = require("express");

//on importe bodyparser pour transformer le corp de la requête en JSON, en objet JS utilisable
const bodyParser = require("body-parser");

//j'importe ma BDD qui est dans le fichier db.config.js
const mongoose = require("./config/db.config")


//on crée une constante app qui est notre application. 
//On appel la méthode express ce qui permet de crée une application express
const app = express();

//on importe nos routes
// const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./app/routes/user");
const sauceRoutes = require("./app/routes/sauce");

//=================================>
/////////////////// middleware CORS
//=================================>
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
//=================================>
/////////////////// middleware CORS
//=================================>

//On importe toute la logique de nos routes. 
app.use("/api/sauce", sauceRoutes);
app.use("/api/auth", userRoutes );

//On exporte notre application pour y avoir accès depuis n'importe qu'elle fichier. 
//Notamment depuis notre serveur node.
module.exports = app;

//Nous devrons être capables d'extraire l'objet JSON de la demande. Il nous faudra le package body-parser
//avant les routes de l'application, on utilise app.use comme middleware global
//on utilise une méthode .json qui va transformer notre requête en objet JSON.
app.use(bodyParser.json());

