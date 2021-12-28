const Joi = require("joi");

const strongPasswordRegex = new RegExp(
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/
);

module.exports.registerValidation = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().trim().email().min(6).required(),
        password: Joi.string()
            .min(8)
            .max(16)
            .pattern(strongPasswordRegex)
            .trim()
            .required(),
    });

    const { error } = schema.validate({ ...req.body });
     if (error) {
       res.status(400).send(error.details[0].message);
     } else {
       next();
    }

}