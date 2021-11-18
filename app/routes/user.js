const express = require("express");
const router = express.Router();

//on a besoin de notre contrôler pour associé les fonctions au différentes routes
const userCtrl = require("../controllers/user");

//on crée deux routes
//ce sont des routes post car le front va également envoyé des informations
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;