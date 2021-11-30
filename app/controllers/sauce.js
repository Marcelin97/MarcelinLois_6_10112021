const Sauce = require("../models/sauce");

//POST
exports.createSauce = (req, res, next) => {
  //supprime l'ID envoyé par le front
  delete req.body._id;
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

//PUT
exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
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
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//GET ALL
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// //LIKE || DISLIKE
// exports.likeOneSauce = (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id }).then((sauce) => {
//     if (req.body.like === 1 && !usersLiked.includes(req.body.userId)) {
//       sauce
//         .updateOne({ _id: req.params.id })
//         .then(() => res.status(200).json({ message: "sauce liked" }))
//         .catch((error) => res.status(400).json({ error }));
//     }
//   });
// };

//LIKE || DISLIKE
exports.likeSauce = (req, res, next) => {
  // Params
  let userId = req.body.userId;
  let like = req.body.like;

  //on vérifie que la sauce existe bien
  if (!sauce) {
    res.status(404).json({
      error: new Error("Cette sauce n'existe pas !"),
    });
  }

  Sauce.findById(req.params.id).then(async (sauce) => {
    // Like
    //If user like
    switch (parseInt(like)) {
      case 1:
        if (sauce.usersDisliked.includes(userId)) {
          sauce.likes--
          sauce.usersDisliked.splice(
            sauce.usersDisliked.indexOf(userId),
            1,
          );
        }
        sauce.usersLiked.push(userId);
        sauce.likes++
        break;
      case 0:
        break;
      case -1:
        break;
    }
  });
};
