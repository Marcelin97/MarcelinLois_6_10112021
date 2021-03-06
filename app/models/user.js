const mongoose = require('mongoose');

//on récupère son contrôleur d'authentification unique
const uniqueValidator = require('mongoose-unique-validator');

//validate the user input
const validator = require("validator");

//=================================>
///////////////// Template for auth.
//=================================>
const userSchema = mongoose.Schema({
  //on rajoute une configuration qui sera unique: true qui évite de s'enregistrer avec le même e-mail
  email: {
    type: String,
    require: true,
    unique: [true, "Email is required"],
    lowercase: true,
    trim: true,
    maxlength: 50,
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    minLength: [8, "Password can't be shorter than 8 characters"],
    trim: true,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Le mot de passe est trop faible !");
      }
    },
  },
  usersAlert:[{ type: String, ref: "User" }],
  reports: { type: Number, default: 0 },
});
//=================================>
///////////////// Template for auth.
//=================================>

//on pass notre validator mongoose en plugin sur notre schema utilisateur
userSchema.plugin(uniqueValidator);

//on exporte le schema sous forme de model, on utilise .model de mongoose
module.exports = mongoose.model('User', userSchema);