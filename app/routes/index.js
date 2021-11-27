const express = require("express");
const router = express.Router();

//on importe nos routes
// const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./user");
const sauceRoutes = require("./sauce");

//On importe toute la logique de nos routes. 
router.use("/sauces", sauceRoutes);
router.use("/auth", userRoutes);

//on exporte le router de ce fichier
module.exports = router;