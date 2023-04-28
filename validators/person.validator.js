const Joi = require("joi");
const personPostSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    firstName: Joi.string().alphanum().required(),
    lastName: Joi.string().alphanum().required(),
    gender: Joi.string().alphanum().required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^\d+$/),
  });

const personPutSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    firstName: Joi.string().alphanum(),
    lastName: Joi.string().alphanum(),
    gender: Joi.string().alphanum(),
    dateOfBirth: Joi.date(),
    email: Joi.string().email(),
    phoneNumber: Joi.string().regex(/^\d+$/),
  });

module.exports = {
  personPostSchema,
  personPutSchema,
};
