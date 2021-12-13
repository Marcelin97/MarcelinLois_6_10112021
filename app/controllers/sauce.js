// Import our sauce model
const Sauce = require("../models/sauce");
// Import the filesystem module
const fs = require("fs");

//=================================>
/////////////////// Create sauce
//=================================>
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // supprime l'ID envoyé par le front
  delete sauceObject._id;
  const sauce = new Sauce({
    // l"opérateur spread ... permet de copier les champs qu'il y a dans la body de la requête
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
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
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      res.status(200).json({
        message: "Sauce updated !!",
      });
    })
    .catch((error) => {
      res.status(403).json({
        error: "Request not allowed !",
      });
    });
};

//=================================>
/////////////////// Delete sauce
//=================================>
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
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
    .then((sauce) => res.status(200).json(sauce))
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

  function removeDislike() {
    //remove 1 dislike
    // sauce.dislikes--;
    //the user's Id is removed from the dislike array
    sauce["usersDisliked"].splice(sauce["usersDisliked"].indexOf(userId), 1);
  }

  function removeLike() {
    //remove 1 like
    // sauce.likes--;
    //the user's Id is removed from the like array
    sauce["usersLiked"].splice(sauce["usersLiked"].indexOf(userId), 1);
  }

  Sauce.findById(req.params.id)
    .then((sauce) => {
      //on vérifie que la sauce existe bien
      if (!sauce) {
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
              sauce["usersLiked"].push(userId);
            } else {
              sauce["usersLiked"].push(userId);
            }
          }
          break;

        // if it's nolike/nodislike
        case 0:
          // If the user already like the sauce
          if (sauce["usersLiked"].includes(userId)) {
            // remove the user from the like array
            sauce["usersLiked"].splice(sauce["usersLiked"].indexOf(userId), 1);
            // if the user already dislike
          } else if (sauce["usersDisliked"].includes(userId)) {
            // remove the user from the dislike array
            sauce["usersDisliked"].splice(
              sauce["usersDisliked"].indexOf(userId),
              1
            );
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
              sauce["usersDisliked"].push(userId);
            } else {
              sauce["usersDisliked"].push(userId);
            }
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
