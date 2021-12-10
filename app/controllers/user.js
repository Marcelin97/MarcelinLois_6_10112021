//on a besoin du package de cryptage de MDP qui est bcrypt
//note: il faut installer le package bcrypt avant
const bcrypt = require("bcrypt");

//on a besoin de notre model users
const User = require("../models/user");

//j'importe mon package pour la vérification et la création de token
const jwt = require("jsonwebtoken");

//=================================>
/// Validation errors from mongoose
//=================================>
const errorFormater = e => {
  let errors = {}
  const allErrors = e.substring(e.indexOf(":") + 1).trim()
  const allErrorsInArrayFormat = allErrors.split(",").map(err => err.trim())
  allErrorsInArrayFormat.forEach((error) => {
    const [key, value] = error.split(":").map((error) => error.trim());
    errors[key] = value;
  });
  return errors
}
//=================================>
/// Validation errors from mongoose
//=================================>

//le contrôleur à besoin de 2 fonction ou aussi appelé middlewares

//////////////////////////////////////////////////////////////////////////////
////////la fonction pour l'enregistrement de nouveaux utilisateurs////////////
//////////////////////////////////////////////////////////////////////////////

exports.signup = (req, res, next) => {
  //la première choses on Hash le mot de pass (c'est une fonction asynchrone qui prends du temps) pour le crypter
  //on appel la fonction bcrypt.hash pour crypter un MDP(on lui passe le MDP du corp de la requête, le salt c'est combien de fois on execute l'algo de hashage)
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
        .then(() => res.status(201).json({ message: "User created!" }))
        //on capte une erreur en 400
        .catch((error) =>
          res.status(400).json({
            message: "Something went wrong.",
            case: "VALIDATION ERROR",
            debugInfo: errorFormater(error.message),
          })
        );
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
  //on va commencer par trouvé le user dans la BDD qui correspond à l'email renseigner par la personne
  User.findOne({ email: req.body.email })
    .then((user) => {
      //si on a pas trouvé de user
      if (!user) {
        //on renvoi un 401 avec notre propre message
        return res.status(401).json({ error: "User not found!" });
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
            return res.status(401).json({ error: "Incorrect password !" });
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
          });
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