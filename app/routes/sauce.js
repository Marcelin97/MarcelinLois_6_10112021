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

/**
 * @swagger
 * /sauces:
 *   get:
 *     tags:
 *       - Read all Sauces.
 *     description: Return an array of all Sauces object.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Return an array of all sauces objects in database.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       imageUrl:
 *                         type: string
 *                         description: A image url.
 *                         example: /images/pexels-cottonbro-3338500.jpg1641993851628.jpg
 *                       items:
 *                         type: string
 *                         description: The sauce's schema.
 *                         required:
 *                          - imageUrl
 *                          - items    
 */
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

//=================================>
/////////////////// report sauce
//=================================>
router.post("/:id/report", auth, sauceCtrl.report);


//on exporte le router de ce fichier
module.exports = router;