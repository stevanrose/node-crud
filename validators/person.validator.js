const Joi = require("joi");
const personSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    firstName: Joi.string().alphanum().required(),
    lastName: Joi.string().alphanum().required(),
    gender: Joi.string().alphanum().required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^\d+$/),
  });

module.exports = personSchema;
