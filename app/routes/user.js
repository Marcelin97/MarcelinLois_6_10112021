const express = require("express");
const router = express.Router();

//on a besoin de notre contrôler pour associé les fonctions au différentes routes
const userCtrl = require("../controllers/user");

//on ajoute notre middleware pour la vérification du MDP
const verifyPassword = require("../middleware/verifyPassword")

// middleware de vérification pour l'email et le mdp
const { registerValidation } = require("../middleware/inputValidation");
//on crée deux routes
//ce sont des routes post car le front va également envoyé des informations

//=================================>
/////////////////// SIGNUP
//=================================>
router.post("/signup", verifyPassword, registerValidation, userCtrl.signup);

//=================================>
/////////////////// LOGIN
//=================================>
router.post("/login", verifyPassword, registerValidation, userCtrl.login);

//=================================>
/////////////////// READ DATAS
//=================================>
router.get(
  "/read-datas",
  verifyPassword,
  registerValidation,
  userCtrl.readDatas
);

//=================================>
/////////////////// EXPORT DATAS
//=================================>
router.get(
  "/export-datas",
  verifyPassword,
  registerValidation,
  userCtrl.exportDatas
);

//on exporte le router de ce fichier
module.exports = router;