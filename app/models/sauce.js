const mongoose = require("mongoose");

//on créer notre schéma pour l'authentification
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true, ref: "User" },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [{ type: String, ref: "User" }],
  usersDisliked: [{ type: String, ref: "User" }],
});

// on exporte le schema sous forme de model, on utilise .model de mongoose
module.exports = mongoose.model("Sauce", sauceSchema);
