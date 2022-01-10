// package de cryptage du MDP
const bcrypt = require("bcrypt");

//on a besoin de notre model users
const User = require("../models/user");

// package pour la vérification et la création de token
const jwt = require("jsonwebtoken");

require("dotenv").config();

// package pour le cryptage de l'email
const CryptoJS = require("crypto-js");

// //le contrôleur à besoin de 2 fonction ou aussi appelé middlewares

// //////////////////////////////////////////////////////////////////////////////
// ////////la fonction pour l'enregistrement de nouveaux utilisateurs////////////
// //////////////////////////////////////////////////////////////////////////////

// encrypte email
function encrypted(email) {
  return CryptoJS.AES.encrypt(
    email,
    CryptoJS.enc.Base64.parse(process.env.PASSPHRASE),
    {
      iv: CryptoJS.enc.Base64.parse(process.env.IV),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
}

// check if the string is an email.
function validateEmail(email) {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

exports.signup = (req, res, next) => {
  
  // Check email validation
  if (!validateEmail(req.body.email)) {
    return res.status(400).json({ error: "L'email indiqué est invalide." });
  }
  //la première choses on Hash le mot de pass (c'est une fonction asynchrone qui prends du temps) pour le crypter
  //on appel la fonction bcrypt.hash pour crypter un MDP(on lui passe le MDP du corp de la requête, le salt c'est combien de fois on execute l'algo de hashage)
  bcrypt
    .hash(req.body.password, 10)
    //comme c'est une méthode asynchrone on a then et un catch
    //on récupère le hash du MDP
    .then((hash) => {
      // Encrypt email
      var emailEncrypted = encrypted(req.body.email);
      //on créer notre nouveau user avec notre modèle mongoose
      const user = new User({
        //on récupère l'e-mail du corp de la requête
        email: emailEncrypted,
        //on récupère le hash du MDP
        password: hash,
      });
      //on utilise la méthode .save pour sauvegarder dans la BDD
      user
        .save()
        //on renvoi un 201 pour une création de ressource et on renvoi un message en objet
        .then(() =>
          res.status(201).json({ message: "User created!" }, hateoasLinks(req))
        )
        //on capte une erreur en 400
        .catch((error) => res.status(422).json({ error }));
    })
    //on capte l'erreur que l'on renvoi dans un objet
    .catch((error) => res.status(500).json({ error }));
};
//////////////////////////////////////////////////////////////////////////////
////////la fonction pour l'enregistrement de nouveaux utilisateurs////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
///////////la fonction pour connecter des utilisateurs existants//////////////
//////////////////////////////////////////////////////////////////////////////

exports.login = (req, res, next) => {
  // Encrypt email
  var emailEncrypted = encrypted(req.body.email);

  //on va commencer par trouvé le user dans la BDD qui correspond à l'email renseigner par la personne
  User.findOne({ email: emailEncrypted })
    .then((user) => {
      //si on a pas trouvé de user
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
      //si on arrive ici c'est qu'on a trouvé un utilisateur
      //on utilise bcrypt pour comparer le MDP envoyé par l'utilisateur qui essai de se connecter avec le user qu'on a reçu de la BDD
      bcrypt
        //on utilise la méthode .compare
        .compare(req.body.password, user.password)
        .then((valid) => {
          //on créer un boolean
          //si la comparaison n'est pas bonne - si le MDP n'est pas le meme
          if (!valid) {
            return res.status(403).json({ error: "Incorrect password !" });
          }
          //si le MDP est le bon l'utilisateur reçoit
          //son user id et son token d'identification
          res.status(200).json({
            userId: user._id,
            //nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token
            //(à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              //L'utilisateur devra donc se reconnecter au bout de 24 heures
              expiresIn: "24h",
            }),
          }, hateoasLinks(req));
        })
        // dans ce cas il va quand meme faire le tour de la bdd meme s'il trouve pas de user,
        //on peut mettre une erreur serveur
        .catch((error) => res.status(500).json({ error }));
    })
    //c'est uniquement si il a un problème de connexion ou lié à mongodb
    //status 500 pour une erreur server
    .catch((error) => res.status(500).json({ error }));
};
//////////////////////////////////////////////////////////////////////////////
///////////la fonction pour connecter des utilisateurs existants//////////////
//////////////////////////////////////////////////////////////////////////////

function hateoasLinks(req) {
  const baseUri = `${req.protocol}://${req.get("host")}`;

  return [
    {
      rel: "signup",
      method: "POST",
      title: "Create User",
      href: baseUri + "/api/auth/signup",
    },
    {
      rel: "login",
      method: "POST",
      title: "Login User",
      href: baseUri + "/api/auth/login",
    },
  ];
}
