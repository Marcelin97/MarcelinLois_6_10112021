const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce")

//middleware d'authentification que nous appliquerons à nos routes pour les protégés
const auth = require("../middleware/auth");

//GET pour un seul objet
router.get("/:id", auth, sauceCtrl.getOneSauce);

//GET
router.get("/", auth, sauceCtrl.getAllSauce);

//on exporte le router de ce fichier
module.exports = router;