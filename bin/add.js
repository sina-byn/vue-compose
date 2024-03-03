const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const fetch = require('node-fetch');

const toCamelCase = str => {
  str = str[0].toLowerCase() + str.slice(1);

  console.log(str);

  str = str.replace(/_|-\w*/g, match => {
    console.log(rest);
    match.replace(/_/);
    return str;
  });

  console.log(str);
  //   str = str.replace(/-|_/g, '');
};

const loadComposables = async () => {
  try {
    const response = await fetch('http://localhost:5173/sample.json');
    const composables = await response.json();

    return composables;
  } catch (err) {
    console.error(err);
  }
};

const writeComposable = (composable, to) => {
  const { name, data } = composable;
  const fileName = `${name}.js`;
  const composablePath = path.join(to, fileName);

  if (fs.existsSync(composablePath)) {
    console.error('already exists');
    return;
  }

  fs.writeFileSync(composablePath, data);
};

module.exports = async (composables, options) => {
  const { output } = options;

  //   toCamelCase('Sina-bayandorian-boazar');

  if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
    console.log('invalid output directory');
    return;
  }

  const allComposables = await loadComposables();

  console.log(allComposables);

  if (composables) {
    const filteredComposables = composables.filter(c => allComposables[c]);

    filteredComposables.forEach(composable => {
      writeComposable({ name: composable, data: allComposables[composable] }, output);
    });

    return;
  }

  // TODO:
  // ! add both ts and js support

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

  selectedComposables.forEach(composable => {
    writeComposable({ name: composable, data: allComposables[composable] }, output);
  });
};
