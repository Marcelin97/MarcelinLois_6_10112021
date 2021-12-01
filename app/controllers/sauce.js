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
      res.status(403).json({
        error: "Requête non autorisé !",
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
    switch (parseInt(like)) {
      //If user like
      case 1:
        message = `La sauce est déjà aimée`;
        //If this user already dislike the sauce
        if (sauce.usersDisliked.includes(userId)) {
          //enlève 1 dislike
          sauce.dislikes--;
          //the user's Id is removed from the dislike array
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
        }
        //and pushed into the like array
        sauce.usersLiked.push(userId);
        //ajoute 1 like
        sauce.likes++;
        message: `Sauce ajouter à la liste des "j'aime"`;
        break;

      // if it's nolike/nodislike
      case 0:
        message = `La sauce n'était pas déjà aimée ou détestée`;
        //If the user already like the sauce
        if (sauce.usersLiked.includes(userId)) {
          sauce.likes--;
          //remove the user from the like array
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
          message: `Sauce retirer de la liste des "j'aime"`;
          //If the user already dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          sauce.dislikes--;
          // remove the user from the dislike array
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          message: `Sauce retirer de la liste "je n'aime pas"`;
        }
        break;

      // if it's a dislike
      case -1:
        message = `La sauce est déjà détestée`;
        // if the user already like the sauce
        if (sauce.usersLiked.includes(userId)) {
          sauce.likes--;
          sauce.usersLiked.push(userId);
          // If the sauce is not already disliked by the user
        }
        sauce.usersDisliked.push(userId);
        sauce.dislikes++;
        message: `Sauce ajouter à la liste des "je n'aime pas"`;
        break;
      default:
        break;
    }

    // Save the sauce and return a message
    Sauce.updateOne({ _id: sauce._id })
      .then(() =>
        res.status(200).json({ message: "Votre avis a été mise à jour ! " })
      )
      .catch((error) => res.status(400).json({ error }));
  });
};
