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
  if (!req.file) {
    //revoir le code erreur
    return res.status(401).json({
      message: "Your request does not contain an image.",
    });
  }

  // Check if request contain text
  if (!req.body) {
    //revoir le code erreur
    return res.status(401).json({
      message: "Your request does not contain text.",
    });
  }

  const sauceObject = JSON.parse(req.body.sauce);

  // supprime l'ID envoyé par le front
  delete sauceObject._id;
  const sauce = new Sauce({
    // l'opérateur spread ... permets de copier les champs qu'il y a dans la requête.
    ...sauceObject,
    //je donne à mon image le nom qui est dans le corp de la requête.
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
    console.log(filename);
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `/images/${req.file.filename}`,
        }
      : { ...req.body };

    // Delete the old image
    try {
      if (sauceObject.imageUrl) {
        fs.unlinkSync(`images/${filename}`);
      }
    } catch(error){
       console.log(error)
    }

    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce updated !!" }))
      .catch((error) =>
        res.status(400).json({ error: "Request not allowed !" })
      );
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
          sauce.imageUrl =
            `${req.protocol}://${req.get("host")}` + sauce.imageUrl;
          //retourne moi sauce avec son lien complet
          return sauce;
        });
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
  const { userId, like } = req.body;

  function changeLike(sauce, userId, state) {
    // If the user already like the sauce
    if (sauce["usersLiked"].includes(userId)) {
      // Remove the user from the like array
      sauce["usersLiked"].splice(sauce["usersLiked"].indexOf(userId), 1);
      sauce.likes--;
    }

    // If the user already dislike
    if (sauce["usersDisliked"].includes(userId)) {
      // Remove the user from the dislike array
      sauce["usersDisliked"].splice(sauce["usersDisliked"].indexOf(userId), 1);
      sauce.dislikes--;
    }

    // The user want to like
    if (state == 1) {
      sauce["usersLiked"].push(userId);
      sauce.likes++;
    }
    // The user want to dislike
    else if (state == -1) {
      sauce["usersDisliked"].push(userId);
      sauce.dislikes++;
    }
  }

  Sauce.findById(req.params.id)
    .then((sauce) => {
      // on vérifie que la sauce existe bien
      if (!Sauce) {
        return res
          .status(404)
          .json({ error: new Error("This sauce does not exist !") });
      }

      switch (like) {
        // If it is a like
        case 1:
          changeLike(sauce, userId, 1);
          break;

        // if it's nolike/nodislike
        case 0:
          changeLike(sauce, userId, 0);
          break;

        // if it's a dislike
        case -1:
          changeLike(sauce, userId, -1);
          break;

        default:
          break;
      }

      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
          res.status(200).json({ message: "The sauce has been updated" });
        })
        .catch((err) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => res.status(404).json({ error }));
};
