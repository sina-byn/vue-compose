const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const fetch = require('node-fetch');
const pkgDir = require('pkg-dir');

// * utils
const { toCamelCase } = require('../utils');

module.exports = async (passedComposables, opts) => {
  const defaultOutput = path.join(pkgDir.sync(), 'src', 'composables');
  const { ts = false, output = defaultOutput } = opts;

  if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
    console.log('invalid output directory');
    return;
  }

  const loadComposables = async () => {
    try {
      const response = await fetch('http://localhost:5173/sample.json');
      const composables = await response.json();

      return composables[ts ? 'ts' : 'js'];
    } catch (err) {
      console.error(err);
    }
  };

  const composables = await loadComposables();
  const ext = ts ? 'ts' : 'js';

  const writeComposable = composable => {
    const code = composables[composable];
    const filename = `${composable}.${ext}`;
    const outputPath = path.join(output, filename);

    if (fs.existsSync(outputPath)) {
      console.error('already exists');
      return;
    }

    fs.writeFileSync(outputPath, code, 'utf-8');
  };

  if (passedComposables.length) {
    for (let composable of passedComposables) {
      composable = toCamelCase(composable);

      if (!(composable in composables)) continue;

      writeComposable(composable);
    }

    return;
  }

  const questions = [
    {
      type: 'multiselect',
      name: 'composables',
      message: 'Pick composables',
      choices: [
        { title: 'use-synced', value: 'useSynced' },
        { title: 'use-mouse', value: 'useMouse' },
      ],
      max: 2,
      hint: '- Space to select. Return to submit',
    },
  ];

  //   const onCancel = prompt => {
  //     console.log('Never stop prompting!');
  //     return true;
  //   };

  const { composables: selectedComposables } = await prompts(questions, {
    // onCancel,
  });

  selectedComposables.forEach(writeComposable);
};
