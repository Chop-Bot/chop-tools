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

  static COMMON_EXPRESSIONS = {
    me: "i('m|m|'ve|'ll|ll|mma)*",
    action: '(want|wanna|gonna|going to|will)',
    yes: '(y|yes|ye|yeah|mhm|sure|ok|okay|alright|alrighty|why not)',
    no: '(no|na|nah|not really|nope)',
    be: '(am|was|will be|are|were|is|be)',
  };

  static listen(message, words) {
    const COMMON_WORDS = Util.COMMON_EXPRESSIONS;
    // replace placeholder with command word
    function commonWord(placeholder) {
      if (Array.isArray(placeholder)) return placeholder;
      const w = placeholder ? `${placeholder.replace(/(\{|\})/g, '').trim()}` : '';
      if (COMMON_WORDS[w]) return COMMON_WORDS[w];
      return placeholder;
    }
    // get the content of the message, remove punctuation and lower case it.
    const content = (message.content || '')
      // eslint-disable-next-line no-useless-escape
      .replace(/[\.,\/#!$%\^&\*;:\{\}=\-_`~()\?]/g, '')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase();

    // regular expression to check if string contains a word
    const makeRegex = w => new RegExp(`(\\s+${w}\\s+|\\s+${w}$|^${w}\\s+|^${w}$)`);
    const wordRegex = makeRegex(commonWord(words));

    // if the words variable is an array check if all of its words are in content
    if (Array.isArray(words)) {
      return words.map(commonWord).every(w => content.match(makeRegex(w)));
    }

    // if words is not an array check if it is in content
    return content.match(wordRegex);
  }

  // Alias for listen()
  static stringMatch(...args) {
    Util.listen(...args);
  }
}

module.exports = Util;
