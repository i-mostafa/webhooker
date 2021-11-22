const path = require("path");
const { existsSync, readFileSync } = require("fs");

const logger = require("./logger");
const configValidationSchema = require("./schemas/config.schema");

const serializeCommits = (commits = []) => {
  return commits.map((commit) => commit.message).join(" - ");
};

exports.logHookReq = ({ ref, pusher, commits } = {}) => {
  const branch = this.getBrach(ref);
  const commitsStr = serializeCommits(commits);

  logger.info(
    `..New push to "${branch}" branch from "${pusher.name}"" with commits: [${commitsStr}]`
  );
};

exports.logTasks = (tasks, { details = false } = {}) => {
  const isMany = tasks.length > 1;
  logger.info(
    `.. {${tasks.length}} task${isMany ? "s" : ""} ${
      isMany ? "have" : "has"
    } been assigned.`
  );
  if (details) console.log(tasks);
};

exports.getBrach = (ref) => ref.split("/").slice(-1)[0];

exports.rootDir = path.resolve("./");

const isFilePath = (str) => /\/*.sh$/g.test(str);

const getCommandsFromFile = (filePath) =>
  readFileSync(filePath)
    .toString()
    .split("\n")
    .filter((cmd) => cmd && !/^#/.test(cmd));

exports.resolveActions = (actions = []) => {
  let newList = [];
  actions.forEach((action) => {
    if (!isFilePath(action)) return newList.push(action);

    // resolve if it is file path

    // make file path always absolute
    if (!path.isAbsolute(action)) action = path.join(this.rootDir, action);

    //  check file existence
    if (!existsSync(action)) logger.error(`Error: can't find "${action}"`);

    // append commands
    newList.push(...getCommandsFromFile(action));
  });
  return newList;
};

exports.resolveTasksActions = (tasks = []) => {
  tasks.forEach((task) => {
    task.actions = this.resolveActions(task.actions);
  });
};

exports.validateConfig = (config) => {
  const result = configValidationSchema.validate(config);
  if (result.error) logger.error(`Error: "${result.error}"`);
};

exports.isArrayWithMinLength = (arr = [], minLength = 1) =>
  arr && Array.isArray(arr) && arr.length >= minLength;
