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
    }`
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
    .catch((error) =>
      res.status(404).json({ message: "Sauce not found" })
    );
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

  //on vérifie que la sauce existe bien
  if (!sauce) {
    res.status(404).json({
      error: new Error ("This sauce does not exist !")
    });
  }

function removeDislikes() {
    //remove 1 dislike
    sauce.dislikes--;
    //the user's Id is removed from the dislike array
    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
  };

  function removeLike() {
    //remove 1 like
    sauce.likes--;
    //the user's Id is removed from the like array
    sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
  };
  
  Sauce.findById(req.params.id).then(async (sauce) => {
    switch (like) {
      //If user like
      case 1:
        //If this user already dislike the sauce
        if (sauce.usersDisliked.includes(userId)) {
          removeDislikes();
        };
        //and pushed into the like array
        sauce.usersLiked.push(userId);
        //add 1 like
        sauce.likes++;
        // message = `Sauce add to the "likes" list`;
        break;

      // if it's nolike/nodislike
      case 0:
        //If the user already like the sauce
        if (sauce.usersLiked.includes(userId)) {
          removeLike();
          // message = `Sauce remove from the "likes" list"`;
          //If the user already dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          removeDislikes();
          // message = `Sauce remove from "I don't like" list`;
        }
        break;

      // if it's a dislike
      case -1:
        // if the user already like the sauce
        if (sauce.usersLiked.includes(userId)) {
          removeLike();
          // If the sauce is not already disliked by the user
        };
        sauce.usersDisliked.push(userId);
        sauce.dislikes++;
        // message = `Sauce add to dislike list"`;
        break;
      default:
        break;
    }

    // Save the sauce and return a message
    Sauce.updateOne({ _id: sauce._id })
      .then(() =>
        res.status(200).json({ message: "The sauce has been updated" })
      )
      .catch((error) => res.status(400).json({ error }));
  });
};
