const express = require("express");
const router = express.Router();

// protect against HTTP Parameter Pollution attacks
const hpp = require('hpp');

// Protect against HPP, should come before any routes
router.use(hpp());

// on importe nos routes
const userRoutes = require("./user");
const sauceRoutes = require("./sauce");

// J'importe mon middleware pour la limite de requête
// et je l'applique sur ma route d'authentification.
const rateLimiter = require("../middleware/rateLimiter");

// J'importe mon middleware pour le ralentissement du débit
// afin de ralentir les réponses du serveur à une adresse IP qui a envoyé trop de demandes.
// et je l'applique sur toutes mes routes.
const slowDown = require("../middleware/speedLimiter");

//  On importe toute la logique de nos routes. 
router.use("/sauces", slowDown, sauceRoutes);
router.use("/auth", slowDown, rateLimiter, userRoutes);

// on exporte le router de ce fichier
module.exports = router;