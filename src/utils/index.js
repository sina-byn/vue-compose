const toCamelCase = str => {
  str = str[0].toLowerCase() + str.slice(1);
  return str.replace(
    /(-\w)/g,
    (_, match) => match[1].toUpperCase() + match.slice(2)
  );
};

module.exports = { toCamelCase };
