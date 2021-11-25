const passwordSchema = require("../models/password");

//vérifie que le MDP valide le schema donné pour s'assurer que le USER utilise une combinaison assez forte
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ error: "Mot de passe pas assez fort !" + passwordSchema.validate(req.body.password, { list: true }) });
    } else {
        next();
    }
};