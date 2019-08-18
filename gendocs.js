/* eslint-disable no-use-before-define */
const fs = require('fs');
const { join } = require('path');
const jsdoc = require('jsdoc-api');
const semver = require('semver');
const rimraf = require('rimraf');

const { version } = require('./package.json');

const dir = join(__dirname, 'docs');

const currentDocs = fs.readdirSync(dir).reduce((files, file) => {
  const name = join(dir, file);
  const isDirectory = fs.statSync(name).isDirectory();
  if (isDirectory) {
    return [...files, file];
  }
  return [...files];
}, []);

const isLatest = currentDocs.reduce((acc, cur) => {
  if (acc) {
    let greater = false;
    try {
      greater = semver.gte(version, cur);
    } catch (e) {
      greater = true;
      /* Directory name in docs isn't semver */
    }
    return greater;
  }
  return false;
}, true);

console.log('Writing docs for version', version);

jsdoc.renderSync(getOptions());

console.log('Given these docs:', currentDocs);
console.log(`The current version, ${version} is${isLatest ? '' : ' not'} the latest version.`);

if (isLatest) {
  console.log('Overwriting docs for latest at', getOptions(true).destination);
  // rimraf.sync(join(dir, 'latest/**'));
  jsdoc.renderSync(getOptions(true));
}

function getOptions(atLatest) {
  return {
    files: ['./src/*', './package.json', './README.md'],
    package: 'package.json',
    readme: 'README.md',
    template: './node_modules/tui-jsdoc-template/',
    tutorials: './tutorials',
    recurse: true,
    destination: join('docs', atLatest ? 'latest' : version),
    configure: './docs.json',
  };
}

module.exports = getOptions();
