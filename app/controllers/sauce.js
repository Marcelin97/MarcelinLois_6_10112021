const Sauce = require("../models/sauce")

<<<<<<< Updated upstream
//POST
exports.createSauce = (req, res, next) => {
  //supprime l'ID envoyé par le front
  delete req.body._id;
=======
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
    return res.status(422).json({
      message: "Your request does not contain an image.",
    });
  }

  // Check if request contain text
  if (!req.body) {
    //revoir le code erreur
    return res.status(422).json({
      message: "Your request does not contain text.",
    });
  }

  const sauceObject = JSON.parse(req.body.sauce);

  // supprime l'ID envoyé par le front
  delete sauceObject._id;
>>>>>>> Stashed changes
  const sauce = new Sauce({
    //l"opérateur spread ... permet de copier les champs qu'il y a dans la body de la requête
    ...req.body,
  });
  //on utilise la méthode .save pour sauvegarder dans la BDD
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

<<<<<<< Updated upstream
//PUT
exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id})
    .then(() => {
      res.status(200).json({
        message: "Sauce mise à jour avec succès !!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
=======
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
    } catch (error) {
      console.log(error);
    }

    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce updated !!" }))
      .catch((error) =>
        res.status(500).json({ error: "Request not allowed !" })
      );
  });
>>>>>>> Stashed changes
};

//DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      res.status(404).json({
        error: new Error("Sauce non trouvé !"),
      });
    }
    if (sauce.userId !== req.auth.userId) {
      res.status(400).json({
        error: new Error("Requête non autorisé !"),
      });
    }
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).json({
          message: "Sauce supprimé !",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};

//GET ONE
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//GET ALL
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

