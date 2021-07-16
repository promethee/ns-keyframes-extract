const { config } = require('./package.json');
const fs = require('fs');
const { send } = require('micro');
let match = require('fs-router')(__dirname + '/routes');

const { files_directory = 'files' } = config;

const checkDirectory = (current, next, _) => {
  const directory = `${current}/${next}`;
  if (current.length > 1 && !fs.existsSync(current)) throw new Error(`"${current}" not found`);
  if (!fs.existsSync(directory)) throw new Error(`"${directory}" not found`);
  console.info(`directory found: "${directory}"`);
  return directory;
};

const _directory = files_directory.includes('./') ? files_directory : `./${files_directory}`;
const directory_chunks = _directory.split('/');
const cleaned_chunks = directory_chunks.filter((directory) => directory.length);
cleaned_chunks.reduce(checkDirectory);
 
module.exports = async (req, res) => {
  let matched = match(req);
  if (matched) return await matched(req, res);
  send(res, 404, { error: 'Not found' });
};
