const express = require("express");
const router = express.Router();

//on a besoin de notre controler pour associé les fonctions au différentes routes
const userCtrl = require("../constrollers/user");



//on crée deux routes
//ce sont des routes post car le front envoie ces informations
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;