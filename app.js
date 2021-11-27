//on a besoin d'express. On importe express dans une constante
const express = require("express");

//on importe bodyParser pour transformer le corp de la requête en JSON, en objet JS utilisable
const bodyParser = require("body-parser");

//j'importe ma BDD qui est dans le fichier db.config.js
const mongoose = require("./config/db.config");

const router = require("./app/routes/index");
//on crée une constante app qui est notre application. 
//On appel la méthode express ce qui permet de crée une application express
const app = express();

//=================================>
/////////////////// middleware CORS
//=================================>
const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
//=================================>
/////////////////// middleware CORS
//=================================>

//On exporte notre application pour y avoir accès depuis n'importe qu'elle fichier. 
//Notamment depuis notre serveur node.
module.exports = app;

//Nous devrons être capables d'extraire l'objet JSON de la demande. Il nous faudra le package body-parser
//avant les routes de l'application, on utilise app.use comme middleware global
//on utilise une méthode .json qui va transformer notre requête en objet JSON.
app.use(bodyParser.json());

//on récupère nos routes qui est l'index.js, appelé router.
app.use("/api", router);


app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
// //paramètre les cookies en HTTP-only pour qu'ils ne puissent pas être modifié par un tiers
// app.use(session({
//   secret: "s3cur3"
//   cookie: {
//     secure: true,
//     httponly: true,
//     domain: 'http://localhost:3000'
//   }
// }));
