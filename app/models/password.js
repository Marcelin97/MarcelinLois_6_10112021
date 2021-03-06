const passwordValidator = require("password-validator");

//=================================>
///////////////// Template password
//=================================>
const passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(16)                                  // Maximum length 16
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
//=================================>
///////////////// Template password
//=================================>

//on exporte notre schéma pour les MDP
module.exports = passwordSchema;