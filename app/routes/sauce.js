const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce")

//middleware d'authentification que nous appliquerons à nos routes pour les protégés
const auth = require("../middleware/auth");

//POST
router.post("/", auth, sauceCtrl.createSauce);

//PUT
router.put("/:id", auth, sauceCtrl.modifySauce);

//DELETE
router.delete("/:id",auth, stuffCtrl.deleteSauce);

//GET pour un seul objet
router.get("/:id", auth, sauceCtrl.getOneSauce);

//GET ALL
router.get("/", auth, sauceCtrl.getAllSauces);

//on exporte le router de ce fichier
module.exports = router;