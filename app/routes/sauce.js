const express = require("express");
const router = express.Router();

//on importe nos controllers pour les sauces
const sauceCtrl = require("../controllers/sauce")

//middleware d'authentification que nous appliquerons à nos routes pour les protégés
const auth = require("../middleware/auth");

//=================================>
/////////////////// Create sauce
//=================================>
router.post("/", auth, sauceCtrl.createSauce);

//=================================>
/////////////////// Update sauce
//=================================>
router.put("/:id", auth, sauceCtrl.modifySauce);

//=================================>
/////////////////// Delete sauce
//=================================>
router.delete("/:id",auth, sauceCtrl.deleteSauce);

//=================================>
/////////////////// Get one sauce
//=================================>
router.get("/:id", auth, sauceCtrl.getOneSauce);

//=================================>
/////////////////// Get all sauces
//=================================>
router.get("/", auth, sauceCtrl.getAllSauces);

//=================================>
/////////////////// Like sauce
//=================================>
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//on exporte le router de ce fichier
module.exports = router;