const Joi = require("joi");

const taskValidationSchema = Joi.object({
  name: Joi.string(),
  branches: Joi.array().items(Joi.string()),
  allowedUsers: Joi.array().items(Joi.string()),
  actions: Joi.array().items(Joi.string()).min(1).required(),
});

module.exports = taskValidationSchema;
