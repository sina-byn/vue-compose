const chalk = require('chalk');

module.exports = {
  error: (...messages) => console.log(chalk.red('[ERROR]', ...messages)),
};
