const { logTasks, resolveTasksActions, validateConfig } = require("./utils");
const logger = require("./logger");

module.exports = (filePath = "./config.json") => {
  const config = require(filePath);

  validateConfig(config);

  process.env.SECRET = config.secret;
  process.env.PORT = config.port || 6060;

  if (!Array.isArray(config.tasks) || config.length === 0)
    logger.error(
      "Error: Tasks should be an array with at least one task object"
    );
  resolveTasksActions(config.tasks);

  logTasks(config.tasks, { details: true });

  global.__tasks = config.tasks;
};
