const Joi = require('joi');

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(32).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/).required(),
  }).unknown();

  return schema.validate(user);
};

module.exports = validateUser;
