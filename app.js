//on a besoin d'express. On importe express dans une constante
const express = require("express");
//on crée une constante app qui est notre application. 
//On appel la méthode express ce qui permet de crée une application express
const app = express();

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

// on exporte notre application pour y avoir accès depuis n'importe qu'elle fichier. 
//Notamment depuis notre serveur node.
module.exports = app;

app.use((req, res, next) => {
  //enregistre « Requête reçue ! » dans la console
    console.log("Requête bien reçu !");
    //passe au prochain middlewares pour terminer cette première requête
  next();
});

app.use((req, res, next) => {
  //on modifie le code de la réponse HTTP, on le modifie en code 201 à la réponse
  res.status(201);
  //passe l'exécution
  next();
});

app.use((req, res, next) => {
  //envoie l'objet réponse et la méthode JSON pour renvoyé une réponse en format JSON
  res.json({ message: "Votre requête a bien été reçue !" });
  //passe l'exécution
  next();
});

app.use((req, res, next) => {
  //enregistre « Réponse envoyée avec succès ! » dans la console
  console.log("Réponse envoyée avec succès");
});

