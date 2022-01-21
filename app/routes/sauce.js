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

/**
 * @swagger
 * /sauces:
 *   post:
 *     tags:
 *       - CREATE one sauce.
 *     description: Post a new sauce.
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Create a new sauce.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Sauce saved.
 *                         example: Sauce saved !
 *                         required:
 *                          - imageUrl
 *                          - items    
 */

router.post("/", auth, multer, sauceCtrl.createSauce);

//=================================>
/////////////////// Get one sauce
//=================================>

/**
 * @swagger
 * /sauces/{id}:
 *   get:
 *     tags:
 *       - READ one specific sauce.
 *     description: Read one sauce by id.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: Sauce id
 *         name: Sauce id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Get one specific sauce.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Sauce id.
 *                         example: 61ded67bb4388e273567b2ab
 *                       name:
 *                         type: string
 *                         description: Sauce name.
 *                         example: Piquante
 *                       manufacturer:
 *                         type: string
 *                         description: Company name.
 *                         example: Sauce and company
 *                       description:
 *                         type: string
 *                         description: Sauce description.
 *                         example: Sauce description.
 *                       mainPepper:
 *                         type: string
 *                         description: ingredient
 *                         example: chilli, pepper.
 *                       imageUrl:
 *                         type: string
 *                         description: imageUrl
 *                         example: /images/pexels-cottonbro-3338500.jpg1641993851628.jpg
 *                       heat:
 *                         type: number
 *                         description: powerful
 *                         example: 7
 *                       like:
 *                         type: number
 *                         description: number of likes
 *                         example: 7
 *                       dislikes:
 *                         type: number
 *                         description: number of dislikes
 *                         example: 2
 *                       usersLiked:
 *                         type: string
 *                         description: id of user like
 *                         example: 61d21e34abb206267aa1ad3f
 *                       usersDisliked:
 *                         type: string
 *                         description: id of user dislike
 *                         example: 61d21e34abb206267aa1B677g
 *                       usersAlert:
 *                         type: string
 *                         description: id of user Alert
 *                         example: 61d21e34abb20626rtyu4770
 *                       reports:
 *                         type: number
 *                         description: number of report in this sauce
 *                         example: 1
 *                         required:
 *                          - imageUrl
 *                          - items    
 */

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

/**
 * @swagger
 * /sauces/{id}:
 *   put:
 *     tags:
 *       - UPDATE an existing sauce.
 *     description: Update one sauce by id.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: Sauce id
 *         name: Sauce id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Get one specific sauce.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Sauce id.
 *                         example: Sauce update
 */

router.put("/:id", auth, multer, sauceCtrl.updateSauce);

//=================================>
/////////////////// Delete sauce
//=================================>

/**
 * @swagger
 * /sauces/{id}:
 *   delete:
 *     tags:
 *       - DELETE an existing sauce.
 *     description: Delete one sauce by id.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: Sauce id
 *         name: Sauce id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Delete one specific sauce.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Sauce id.
 *                         example: Sauce deleted !
 */

router.delete("/:id",auth, sauceCtrl.deleteSauce);

//=================================>
/////////////////// Like sauce
//=================================>

/**
 * @swagger
 * /sauces/{id}/like:
 *   put:
 *     tags:
 *       - LIKE an existing sauce.
 *     description: Like or dislike sauce.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: Sauce id
 *         name: 60e6d87e80ef5f71eaa28a2a
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Get one specific sauce.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Like value (1 = like, 0 = cancel, -1 = dislike)
 *                         example: 1
 *                         minmum: -1
 *                         maximu: 1
 */

router.post("/:id/like", auth, sauceCtrl.likeSauce);

//=================================>
/////////////////// report sauce
//=================================>

/**
 * @swagger
 * /sauces/{id}/like:
 *   post:
 *     tags:
 *       - REPORT an existing sauce.
 *     description: A user can report a sauce.
 *     produces:
 *       - application/json
 *     parameters:
 *       - username: Sauce id
 *         name: 60e6d87e80ef5f71eaa28a2a
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Report one specific sauce.
 *         requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Sauce reported by user.
 *                         example: Sauce reported !
 */

router.post("/:id/report", auth, sauceCtrl.report);


//on exporte le router de ce fichier
module.exports = router;