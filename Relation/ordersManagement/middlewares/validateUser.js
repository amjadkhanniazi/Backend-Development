import Joi from "joi";

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
  }).unknown();

  return schema.validate(user);
};

export default validateUser;
