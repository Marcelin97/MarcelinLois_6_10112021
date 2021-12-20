// Import our sauce model
const Sauce = require("../models/sauce");

// The fs module of Node.js provides useful functions for interacting with the filesystem.
const fs = require("fs");

// The Path module provides a way of working with directories and file paths.
const path = require("path");

//=================================>
/////////////////// Create sauce
//=================================>
exports.createSauce = (req, res, next) => {

  // Check if request contain files uploaded
  if (!req.body || !req.file) {
    return res.status(401).json({
      message: "Your request does not contain an image.",
    });
  }

  const sauceObject = JSON.parse(req.body.sauce);

  // supprime l'ID envoyé par le front
  delete sauceObject._id;
  const sauce = new Sauce({
    // l'opérateur spread ... permets de copier les champs qu'il y a dans le corp de la req.
    ...sauceObject,
    //je donne à mon image le nom qui est dans le corp de la req.
    imageUrl: `/images/${req.file.filename}`,
  });
  // on utilise la méthode .save pour sauvegarder dans la BDD
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce saved !" }))
    .catch((error) => res.status(400).json({ error }));
};

//=================================>
/////////////////// Update sauce
//=================================>
exports.updateSauce = (req, res, next) => {
  //je récupère l'image existante de ma sauce
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl:  `/images/${
          req.file.filename
        }`,
          }
        : { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce updated !!" }))
        .catch((error) => res.status(400).json({ error, error: "Request not allowed !" }));
    });
  });
};

//=================================>
/////////////////// Delete sauce
//=================================>
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // je récupère le chemin ou est stocké mon image pour pouvoir la supprimer
      const imageUrl = path.join(__dirname, "../..", sauce.imageUrl);
      //fs.unlink permets de supprimé l'image
      fs.unlink(imageUrl, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce deleted !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//=================================>
/////////////////// Get one sauce
//=================================>
exports.readOneSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // console.log(sauce);
      //le nom de la propriété est = au lien de l'url + le chemin relatif de l'image
      sauce.imageUrl = `${req.protocol}://${req.get("host")}` + sauce.imageUrl;
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ message: "Sauce not found" }));
};

//=================================>
/////////////////// Get all sauces
//=================================>
exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      if (sauces.length <= 0) {
        return res.status(404).json({
          error: "No sauces to display",
        });
      } else {
        //j'itère sur chaque sauce afin de lui ajouter l'URI de mon API et l'adresse de l'image
        //sauce c'est mon x
        sauces = sauces.map((sauce) => {
          sauce.imageUrl = `${req.protocol}://${req.get("host")}` + sauce.imageUrl;
          //retourne moi sauce avec son lien complet
          return sauce
        })
        res.status(200).json(sauces);
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

//================================>
/////////////////// LIKE // DISLIKE
//=================================>
exports.likeSauce = (req, res, next) => {
  // Params
  let userId = req.body.userId;
  let like = req.body.like;

  Sauce.findById(req.params.id)
    .then((sauce) => {

      //on vérifie que la sauce existe bien
      if (!Sauce) {
        return res.status(404).json({
          error: new Error("This sauce does not exist !"),
        });
      }

      switch (like) {
        // If it is a like
        case 1:
          // if this user doesn't already like the sauce,
          if (!sauce["usersLiked"].includes(userId)) {
            // and this user already dislike the sauce
            if (sauce["usersDisliked"].includes(userId)) {
              sauce["usersDisliked"].splice(
                sauce["usersDisliked"].indexOf(userId),
                1
              );
            }
            sauce["usersLiked"].push(userId);
            sauce.likes++;
            }
          break;

        // if it's nolike/nodislike
        case 0:
          // If the user already like the sauce
          if (sauce["usersLiked"].includes(userId)) {
            // remove the user from the like array
            sauce["usersLiked"].splice(sauce["usersLiked"].indexOf(userId), 1);
            sauce.likes--;
            // if the user already dislike
          } else if (sauce["usersDisliked"].includes(userId)) {
            // remove the user from the dislike array
            sauce["usersDisliked"].splice(
              sauce["usersDisliked"].indexOf(userId),
              1
            );
            sauce.dislikes--;
          }
          break;

        // if it's a dislike
        case -1:
          // if the user doesn't already dislike the sauce
          if (!sauce["usersDisliked"].includes(userId)) {
            // and the user already like the sauce
            if (sauce["usersLiked"].includes(userId)) {
              // remove the user from the like array and push the user in the dislike array
              sauce["usersLiked"].splice(
                sauce["usersLiked"].indexOf(userId),
                1
              );
            }
            sauce["usersDisliked"].push(userId);
            sauce.dislikes--;
            }
          break;

        default:
          break;
      }
      // Set the number of likes and dislikes for this sauce to the length of each according array
      sauce["dislikes"] = sauce["usersDisliked"].length;
      sauce["likes"] = sauce["usersLiked"].length;

      Sauce.updateOne(
        {
          _id: req.params.id,
        },
        sauce
      )
        .then(() => {
          res.status(200).json({
            message: "The sauce has been updated",
          });
        })
        .catch((err) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => res.status(404).json({ error }));
};
