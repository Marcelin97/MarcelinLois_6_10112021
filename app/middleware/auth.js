//on a besoin de notre package pour vérifier les tokens
const jwt = require("jsonwebtoken");

//on exporte un middleware
//on utilise des blocs try catch, car il y a plusieurs éléments qui peuvent posé problème
module.exports = (req, res, next) => {
  try {
    //on va utiliser le faite qu'on connaît la forme de se headers pour récupérer le token
    //on utilise les headers de la requête et le header autorisation que l'on va splite autour d'un espace
    // sa nous retourne un tableau avec bear en premier et le token en deuxième élément
    //donc sa nous retournera uniquement le token
    const token = req.headers.authorization.split(" ")[1];
    //la seconde étape et de décoder le token
    //on va utiliser le package jsonwebtoken et la fonction verify
    //(on vérifie le token et on veut vérifier la clé secrete)
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //quand on décode le token cela devient un objet JS
    // donc on va pouvoir récupérer le userId qui est dedans
    const userId = decodedToken.userId;
    //si jamais il y a un userId dans le corp de la requete on veut vérifier que cela correspond bien a celle du token
    //dans le if c'est si cela ne correspond pas
    if (req.body.userId && req.body.userId !== userId) {
      //on peut utiliser throw pour renvoyé une erreur
      throw "User ID non valable !";
      //sinon si tout va bien on peut passer la requête au prochain middleware
    } else {
      next();
    }
  } catch (error) {
    //on renvoi une erreur 401 pour une erreur d'authentification
    //et dans le json si on reçoit une erreur on veut l'envoyé sinon cela envoi un message
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
