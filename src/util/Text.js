const filesize = require('filesize');
const duration = require('humanize-duration');

module.exports = class Text {
  constructor() {
    throw new Error("Bruh... you can't instantiate Text.");
  }

  static capitalize(string) {
    if (string === null || string === undefined) return '';
    string = String(string).trim();
    if (string.length < 1) return '';
    return string[0].toUpperCase() + string.substr(1);
  }

  static capitalizeAll(string) {
    if (string === null || string === undefined) return '';
    string = String(string).trim();
    if (string.length < 1) return '';
    return string.replace(/^[a-z]|(?<=\s+|")[a-z]/gm, match => match.toUpperCase());
  }

  static duration(string) {
    if (string === null || string === undefined) return '';
    string = String(string).trim();
    if (string.length < 1) return '';
    return string.replace(/{duration:.*?}/gi, match => {
      const milliseconds = match.match(/(?<={duration:)\d*(?=})/i);
      return Number.isNaN(milliseconds) || milliseconds === null ? '?' : duration(milliseconds);
    });
  }

  static filesize(string) {
    if (string === null || string === undefined) return '';
    string = String(string).trim();
    if (string.length < 1) return '';
    return string.replace(/{filesize:.*?}/gi, match => {
      const milliseconds = parseInt(match.match(/(?<={filesize:).*?(?=})/i), 10);
      if (Number.isNaN(milliseconds) || milliseconds === null) return '?';
      return filesize(milliseconds);
    });
  }
};
