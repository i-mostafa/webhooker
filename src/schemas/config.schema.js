const Joi = require("joi");
const taskValidationSchema = require("./task.schema");

const configValidationSchema = Joi.object({
  secret: Joi.string(),
  port: Joi.number(),
  tasks: Joi.array().items(taskValidationSchema).min(1).required(),
});

module.exports = configValidationSchema;
