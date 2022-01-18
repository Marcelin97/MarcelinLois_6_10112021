// package de cryptage du MDP
const bcrypt = require("bcrypt");

//on a besoin de notre model users
const User = require("../models/user");

// package pour la vérification et la création de token
const jwt = require("jsonwebtoken");

require("dotenv").config();

// package pour le cryptage de l'email
const CryptoJS = require("crypto-js");
const Sauce = require("../models/sauce");

// Import the filesystem module
const fs = require("fs");
const fsPromises = require("fs").promises;

//=================================>
/////////////////// ENCRYPTED EMAIL
//=================================>
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
//=================================>
/////////////////// ENCRYPTED EMAIL
//=================================>

//=================================>
/////////////////// DECRYPT EMAIL
//=================================>
function decryptEmail(email) {
  var bytes = CryptoJS.AES.decrypt(
    email,
    CryptoJS.enc.Base64.parse(process.env.PASSPHRASE),
    {
      iv: CryptoJS.enc.Base64.parse(process.env.IV),
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}
//=================================>
/////////////////// DECRYPT EMAIL
//=================================>

// check if the string is an email.
function validateEmail(email) {
  const res =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

// //le contrôleur à besoin de 2 fonction ou aussi appelé middlewares

// //////////////////////////////////////////////////////////////////////////////
// ////////la fonction pour l'enregistrement de nouveaux utilisateurs////////////
// //////////////////////////////////////////////////////////////////////////////

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
          res.status(200).json(
            {
              userId: user._id,
              //nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token
              //(à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
              token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
                //L'utilisateur devra donc se reconnecter au bout de 24 heures
                expiresIn: "24h",
              }),
            },
            hateoasLinks(req)
          );
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

//////////////////////////////////////////////////////////////////////////////
/////////////la fonction pour lire les données d'un utilisateur///////////////
//////////////////////////////////////////////////////////////////////////////
exports.readDatas = (req, res, next) => {
  // Encrypt email
  var emailEncrypted = encrypted(req.body.email);
  User.findOne({ email: emailEncrypted })
    .then((user) => {
      //si on a pas trouvé de user
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
      // Decrypt email
      user.email = decryptEmail(emailEncrypted);
      res.status(200).json(user, hateoasLinks(req));
    })
    .catch((error) => {
      res.status(404).send({ error });
    });
};
//////////////////////////////////////////////////////////////////////////////
/////////////la fonction pour lire les données d'un utilisateur///////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
///////////la fonction pour exporter les données d'un utilisateur/////////////
//////////////////////////////////////////////////////////////////////////////
exports.exportDatas = (req, res, next) => {
  // Encrypt email
  var emailEncrypted = encrypted(req.body.email);

  const userSauces = [];

  User.findOne({ email: emailEncrypted })
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
      // Decrypt email
      user.email = decryptEmail(emailEncrypted);

      try {
        const sauces = await Sauce.find({ userId: user._id });

        if (sauces.length <= 0) {
          userSauces.push("You don't have any sauce in our DB");
        } else {
          userSauces.push(sauces);
        }
      } catch (error) {
        console.log(error);
      }

      const result = { ...user._doc, sauces: userSauces };

      // write result to file

      // we must create a JSON string of the data with JSON.stringify
      // we told stringify to enter the data with 2 spaces.
      const resultJsonString = JSON.stringify(result, null, 2);
      // console.log(jsonString);

      fs.writeFile(__dirname + "/test.txt", resultJsonString, (err) => {
        if (err) {
          console.log("Error writing file", err);
        } else {
          console.log("Successfully wrote file");
        }
      });
      return res.status(200).json(result);
    })
    .catch((error) => res.status(500).json({ error }));
};
//////////////////////////////////////////////////////////////////////////////
/////////////la fonction pour lire les données d'un utilisateur///////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//////////////////////la fonction pour supprimer son compte///////////////////
//////////////////////////////////////////////////////////////////////////////
exports.delete = (req, res) => {
  // Encrypt email
  var emailEncrypted = encrypted(req.body.email);
  User.findOneAndDelete({ email: emailEncrypted })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete user",
      });
    });
};
//////////////////////////////////////////////////////////////////////////////
//////////////////////la fonction pour supprimer son compte///////////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//////////////////////la fonction pour modifier son compte///////////////////
//////////////////////////////////////////////////////////////////////////////
//Three case, if only email, if only password and if twice
// exports.update = async function (req, res) {
//   const hash = await bcrypt.hash(req.body.password, 10);

// User.findOneAndUpdate(
//   req.params.id,
//   {
//     // _id: req.body.id,
//     email: req.body.email,
//     password: hash,
//   },
//   function (err, result) {
//     if (err) {
//       console.log("err", err);
//       res.send("error updating user");
//     } else {
//       console.log(result);
//       res.status(200).send({
//         user: result,
//         msg: "data updated successfully",
//       });
//     }
//   }
// );
// };

exports.update = async (req, res) => {
  // Find user in the current session
  // Encrypt email
  var emailEncrypted = encrypted(req.body.email);
  
  let user = await User.findOne({ email: req.body.email });
  // If user not found, return an error
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  //If user change password
  //     //sinon si je ne modifie pas mon email et que je modifie mon MDP alors...
  if (!req.body.email && req.body.password) {
    // Encrypt the password send in request and save in the User object
    const hash = await bcrypt.hash(req.body.password, 10);
    // Save the password
    user.password = hash;
  }

  // If user change email
  //si je modifie mon email et que je ne modifie pas mon MDP alors...
  if (req.body.email && !req.body.password) {
    // Check email validation
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({ error: "The specified email is invalid." });
    }

    // Encrypt email
    var emailEncrypted = encrypted(req.body.email);

    // Save the email in the User object
    user.email = emailEncrypted;
  }

  // Save the user and return a response
  user
    .updateOne()
    .then(() => {
      res
        .status(201)
        .json({ message: "User updated successfully" }, hateoasLinks(req));
    })
    .catch((error) => res.status(400).json({ error }));
};
//////////////////////////////////////////////////////////////////////////////
//////////////////////la fonction pour modifier son compte///////////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
///////////////////////la fonction pour signaler un compte////////////////////
//////////////////////////////////////////////////////////////////////////////
exports.report = (req, res, next) => {
  // Params
  const { userId, report } = req.body;

  function reportSauce(sauce, userId, state) {
    // The user want to report
    if (state == 1) {
      sauce["usersAlert"].push(sauce["usersAlert"].indexOf(userId), 1);
      sauce.reports++;
    }o
  }

  Sauce.findById(req.params.id)
    .then((sauce) => {
      // on vérifie que la sauce existe bien
      if (!Sauce) {
        return res
          .status(404)
          .json({ error: new Error("This sauce does not exist !") });
      }

      switch (report) {
        case 1:
          reportSauce(sauce, userId, 1);
          break;

        default:
          break;
      }

      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
          res.status(200).json(sauce, hateoasLinks(req, sauce._id));
        })
        .catch((err) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

//////////////////////////////////////////////////////////////////////////////
///////////////////////la fonction pour signaler un compte////////////////////


//=================================>
/////////////////// HATEOAS LINKS
//=================================>
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
    {
      rel: "read",
      method: "GET",
      title: "Read User Datas",
      href: baseUri + "/api/auth/read-datas",
    },
    {
      rel: "export",
      method: "GET",
      title: "Export User Datas",
      href: baseUri + "/api/auth/export-datas",
    },
    {
      rel: "update",
      method: "PUT",
      title: "Update User",
      href: baseUri + "/api/auth/update",
    },
    {
      rel: "delete",
      method: "DELETE",
      title: "Delete User",
      href: baseUri + "/api/auth/delete",
    },
  ];
}
//=================================>
/////////////////// HATEOAS LINKS
//=================================>
