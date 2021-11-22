const chalk = require("chalk");

exports.info = (msg) => {
  console.log(chalk.green(msg));
};

exports.error = (msg) => {
  console.log(chalk.red(msg));
  process.exit(1);
};

exports.log = (msg) => {
  console.log(chalk.blue(msg));
};
