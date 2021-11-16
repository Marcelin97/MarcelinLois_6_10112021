const express = require("express");
const router = express.Router();


//on importe nos modèles
const User = require("../models/user");
// const Sauce = require("../models/sauce");

router.post('/', (req, res, next) => {
  //on supprime en amont le faux_id envoyé par le front-end
  delete req.body._id;
  const user = new User({
    //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    ...req.body,
  });
  user
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

router.use('/', (req, res, next) => {
  //enregistre « Requête reçue ! » dans la console
  console.log("Requête bien reçu !");
  //passe au prochain middlewares pour terminer cette première requête
  next();
});

router.use('/', (req, res, next) => {
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

//on exporte le router de ce fichier
module.exports = router;