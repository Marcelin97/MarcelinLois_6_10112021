const mongoose = require('mongoose');

//on récupère son contrôleur d'authentification unique
const uniqueValidator = require('mongoose-unique-validator');

//=================================>
///////////////// Template for auth.
//=================================>
const userSchema = mongoose.Schema({
    //on rajoute une configuration qui sera unique: true qui évite de s'enregistrer avec le même e-mail
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});
//=================================>
///////////////// Template for auth.
//=================================>

//on pass notre validator mongoose en plugin sur notre schema utilisateur
userSchema.plugin(uniqueValidator);

//on exporte le schema sous forme de model, on utilise .model de mongoose
module.exports = mongoose.model('User', userSchema);