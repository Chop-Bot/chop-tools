const moment = require('moment');

const momentDurationFormatSetup = require('moment-duration-format');

momentDurationFormatSetup(moment);

class Util {
  static mapByName(items) {
    // NOTE: Command name must be lower cased.
    return new Map(items.map(item => [item.name.toLowerCase(), item]));
  }

  static format(...args) {
    let a = args[0];
    const vars = args.slice(1);
    // eslint-disable-next-line no-restricted-syntax
    for (const k in vars) {
      if (a.includes(k)) {
        const exp = new RegExp(`\\{${k}\\}`, 'g');
        a = a.replace(exp, vars[k]);
      }
    }
    return a;
  }

  static secondsToTime(seconds) {
    return moment.duration(Number(seconds), 'seconds').format();
  }

  static isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }
}

module.exports = Util;
