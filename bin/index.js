#! /usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');

// * scripts
const add = require('../src/commands/add');

program
  .name('vue-compose')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.configureOutput({
  writeErr: error => process.stdout.write(chalk.red('[ERROR]', error)),
});

program
  .command('add')
  .argument('[composables...]', 'composables')
  .option('-o, --output <string>', 'set config') // ! can be converted to a requriedOption
  .option('--typescript, --ts', 'use ts for composables') // ! can be converted to a requriedOption
  .allowExcessArguments()
  .action(add);

program.parse();
