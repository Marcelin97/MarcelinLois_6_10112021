const express = require("express");
const router = express.Router();

//on importe nos controllers pour les sauces
const sauceCtrl = require("../controllers/sauce")

//middleware d'authentification que nous appliquerons à nos routes pour les protégés
const auth = require("../middleware/auth");

//middleware pour les fichiers
const multer = require('../middleware/multer-config')
//=================================>
/////////////////// Create sauce
//=================================>
router.post("/", auth, multer, sauceCtrl.createSauce);

//=================================>
/////////////////// Get one sauce
//=================================>
router.get("/:id", auth, sauceCtrl.readOneSauce);

//=================================>
/////////////////// Get all sauces
//=================================>
router.get("/", auth, sauceCtrl.readAllSauces);

//=================================>
/////////////////// Update sauce
//=================================>
router.put("/:id", auth, multer, sauceCtrl.updateSauce);

//=================================>
/////////////////// Delete sauce
//=================================>
router.delete("/:id",auth, sauceCtrl.deleteSauce);

//=================================>
/////////////////// Like sauce
//=================================>
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//on exporte le router de ce fichier
module.exports = router;