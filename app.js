//on a besoin d'express. On importe express dans une constante
const express = require("express");

//on importe bodyparser pour transformer le corp de la requête en JSON, en objet JS utilisable
const bodyParser = require("body-parser");

//on crée une constante app qui est notre application. 
//On appel la méthode express ce qui permet de crée une application express
const app = express();

//on importe nos router
// const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./app/routes/user")

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

//On importe toute la logique de notre routeur. 
// app.use("/api/stuff", stuffRoutes)
app.use("/api/auth", userRoutes );

// on exporte notre application pour y avoir accès depuis n'importe qu'elle fichier. 
//Notamment depuis notre serveur node.
module.exports = app;

//avant les routes de l'application, on utilise app.use pour ttes les routes de l'application
//on utilise une méthode .json qui va transformer notre requête en objet JSON.
app.use(bodyParser.json());


