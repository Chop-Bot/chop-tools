const filesize = require('filesize');
const duration = require('humanize-duration');

module.exports = class Text {
  constructor() {
    throw new Error("Bruh... you can't instantiate Text.");
  }

  /**
   * Capitalizes the first letter in a string.
   *
   * @static
   * @param {string} string
   * @returns {string} Capitalized string.
   * @example
   * Text.capitalize('*welcome back*'); // -> *Welcome back*
   */
  static capitalize(string) {
    if (string === null || string === undefined) return '';
    string = String(string).trim();
    if (string.length < 1) return '';
    return string.replace(/[a-zA-Z]/, letter => letter.toUpperCase());
  }

  /**
   * Capitalizes the first letter of every word in the string.
   * @static
   * @param {string} string
   * @returns {string} Capitalized string.
   * @example
   * Text.capitalizeAll('the sky is clear today'); // -> The Sky Is Clear Today
   */
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

  /**
   * Joins all arguments as strings with line breaks.
   * @static
   * @param {string[]} lines
   * @returns {string} lines joined with line breaks.
   * @example
   * // This call
   * Text.lines('Hello', 'World');
   * // Will return
   * // Hello
   * // World
   */
  static lines(...lines) {
    if (!lines || !lines.length) return '';
    if (!lines.length === 1) return String(lines[0]);
    return lines.reduce((all, current) => `${all}\n${String(current).trim()}`, '').trim();
  }

  static numbers(string) {
    if (!string || typeof string !== 'string') {
      return [];
    }

    string = string
      // removes everything that isn't a number or a dot
      .replace(/[^0-9.\-+]/g, ' ')
      // multiple dots get replaced with space
      .replace(/[.][.]+/g, ' ')
      // collapses minus signs
      .replace(/[-][-]+/g, '-')
      // removes plus signs
      .replace(/(?<=\d)\+(?=\d)/g, ' ')
      .replace(/\+/g, '')
      // collapses all spaces
      .replace(/\s\s+/g, ' ')
      // splits at spaces
      .split(/ +/g);

    return string.map(n => parseFloat(n, 10)).filter(n => !Number.isNaN(n));
  }

  static splitArguments(content, prefix) {
    const args = content
      .trim()
      .substr(prefix.length)
      // collapse spaces
      .replace(/(\s\s+|\n)/g, ' ')
      .split(/ +/);
    const name = args.shift();
    return {
      name: name ? name.toLowerCase() : '',
      args,
    };
  }
};
