const { exec } = require("child_process");
const logger = require("./logger");
const { getBrach, isArrayWithMinLength } = require("./utils");

const execSeries = (actions = []) => {
  const execNext = (action) => {
    if (!action) return;

    logger.info(`--Running: ${action}`);

    exec(action, (error, stdout, stderr) => {
      if (error || stderr) {
        logger.error(`--Error: ${error.message || ""} ${stderr || ""}`);
        return;
      }

      logger.log(stdout);
      logger.info("--Succeed");

      if (actions.length) execNext(actions.shift());
    });
  };
  execNext(actions.shift());
};

const checkTask = (task, { branch, pusher: { name, email } } = {}) => {
  // check branch
  if (isArrayWithMinLength(task.branches) && !task.branches.includes(branch))
    return;

  // check authority
  if (
    isArrayWithMinLength(task.allowedUsers) &&
    !task.allowedUsers.includes(name) &&
    !task.allowedUsers.includes(email)
  )
    return;

  return task.actions;
};

module.exports = ({ ref, pusher } = {}) => {
  const branch = getBrach(ref);
  const actions = [];

  global.__tasks.forEach((task) => {
    actions.push(...checkTask(task, { branch, pusher }));
  });

  execSeries(actions);
};
