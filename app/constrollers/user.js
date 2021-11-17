//on a besoin du package de cryptage de MDP qui est bcrypt
//note: il faut installer le package bcrypt avant
const bcrypt = require("bcrypt");

//on a besoin de notre model users
const User = require("../models/user");

//le contrôleur à besoin de 2 fonction ou aussi appelé middlewares

//////////////////////////////////////////////////////////////////////////////
////////la fonction pour l'enregistrement de nouveaux utilisateurs////////////
//////////////////////////////////////////////////////////////////////////////

exports.signup = (req, res, next) => {
  //la première choses on Hash le mot de pass pour le crypter
  //on appel la fonction bcrypt.hash pour crypter un MDP(on lui passe le MDP du corp de la requête, le solt c'est combien de fois on execute l'algo de hashage)
  bcrypt
    .hash(req.body.password, 10)
    //comme c'est une méthode asynchrone on a then et un catch
    //on récupère le hash du MDP
    .then((hash) => {
      //on créer notre nouveau user avec notre modèle mongoose
      const user = new User({
        //on récupère l'e-mail du corp de la requête
        email: req.body.email,
        //on récupère le hash du MDP
        password: hash
      });
      //on utilise la méthode .save pour sauvegarder dans la BDD
      user
        .save()
        //on renvoi un 201 pour une création de ressource et on renvoi un message en objet
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        //on capte une erreur en 400
        .catch((error) => res.status(400).json({ error }));
    })
    //on capte l'erreur que l'on renvoi dans un objet
    .catch((error) => res.status(500).json({ error }));
};
//////////////////////////////////////////////////////////////////////////////
////////la fonction pour l'enregistrement de nouveaux utilisateurs////////////
//////////////////////////////////////////////////////////////////////////////

exports.login = (req, res, next) => {};
