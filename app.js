const express = require("express");

const app = express();

app.use((req, res, next) => {
  //enregistre « Requête reçue ! » dans la console
    console.log("Requête bien reçu !");
    //passe l'exécution
  next();
});

app.use((req, res, next) => {
  //ajoute un code d'état 201 à la réponse
  res.status(201);
  //passe l'exécution
  next();
});

app.use((req, res, next) => {
  //envoie la réponse JSON
  res.json({ message: "Votre requête a bien été reçue !" });
  //passe l'exécution
  next();
});

app.use((req, res, next) => {
  //enregistre « Réponse envoyée avec succès ! » dans la console
  console.log("Réponse envoyée avec succès");
});

module.exports = app;