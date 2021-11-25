const Sauce = require("../models/sauce")

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
};

//DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Sauce supprimée !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
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

