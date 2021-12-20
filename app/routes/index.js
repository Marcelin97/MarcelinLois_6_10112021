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
// et je l'applique sur ma route d'authentification
const rateLimiter = require("../middleware/rateLimiter");

//  On importe toute la logique de nos routes. 
router.use("/sauces",sauceRoutes);
router.use("/auth", rateLimiter, userRoutes);

// on exporte le router de ce fichier
module.exports = router;