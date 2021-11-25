const Sauce = require("../models/sauce")

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

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};