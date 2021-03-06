const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
});
