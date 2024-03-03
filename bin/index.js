#! /usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');

const add = require('./add');

program.name('vue-compose').description('CLI to some JavaScript string utilities').version('0.8.0');

program.configureOutput({
  writeErr: error => process.stdout.write(chalk.red('[ERROR]', error)),
});

program
  .command('add')
  .argument('[composables...]', 'composables')
  .option('-o, --output <string>', 'set config') // ! can be converted to a requriedOption
  .allowExcessArguments()
  .executableDir('add')
  .action(add);

program.parse();
