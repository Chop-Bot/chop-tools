const Text = require('../src/util/Text');

describe('Text class', () => {
  test('should not be able to instantiate Text', () => {
    const instantiateText = () => new Text();
    expect(instantiateText).toThrow();
  });

  describe('>> capitalization methods', () => {
    test('should capitalize first letter of string', () => {
      expect(Text.capitalize('i am very fat')).toBe('I am very fat');
      expect(Text.capitalize('     i am very fat')).toBe('I am very fat');
      expect(Text.capitalize('I am very fat')).toBe('I am very fat');
      expect(Text.capitalize('')).toBe('');
      expect(Text.capitalize()).toBe('');
      expect(Text.capitalize(null)).toBe('');
      expect(Text.capitalize([])).toBe('');
      expect(Text.capitalize(456)).toBe('456');
      expect(Text.capitalize({})).toBe('[Object Object]');
      expect(Text.capitalize(NaN)).toBe('NaN');
    });

    test('should capitalize first letter of every word', () => {
      expect(Text.capitalizeAll('hello there stranger')).toBe('Hello There Stranger');
      expect(Text.capitalizeAll('      hello there stranger')).toBe('Hello There Stranger');
      expect(Text.capitalizeAll('hello there         stranger')).toBe('Hello There         Stranger');
      expect(Text.capitalizeAll('    hhhhhhhhEllo there MY DUDE   ')).toBe('HhhhhhhhEllo There MY DUDE');
      expect(Text.capitalizeAll('0123456789 n 18 ZZZZ[ ] 1 2[ ')).toBe('0123456789 N 18 ZZZZ[ ] 1 2[');
      expect(Text.capitalizeAll('')).toBe('');
      expect(Text.capitalizeAll()).toBe('');
      expect(Text.capitalizeAll(null)).toBe('');
      expect(Text.capitalizeAll([])).toBe('');
      expect(Text.capitalizeAll(456)).toBe('456');
      expect(Text.capitalizeAll({})).toBe('[object Object]');
      expect(Text.capitalizeAll(NaN)).toBe('NaN');
    });
  });

  describe('>> duration replacement method', () => {
    test('should replace milliseconds with readable duration', () => {
      expect(Text.duration('please wait {duration:5000}')).toBe('please wait 5 seconds');
      expect(Text.duration('please wait {duration:50000}')).toBe('please wait 50 seconds');
      expect(Text.duration('please wait {duration:500000}')).toBe('please wait 8 minutes, 20 seconds');
      expect(Text.duration('please wait {duration:500000}          ')).toBe('please wait 8 minutes, 20 seconds');
      expect(Text.duration('      please       wait {duration:500000}          ')).toBe(
        'please       wait 8 minutes, 20 seconds',
      );
      expect(Text.duration('please wait {duration:}')).toBe('please wait 0 seconds');
      expect(Text.duration('please wait {duration:my ass}')).toBe('please wait ?');
      expect(Text.duration()).toBe('');
      expect(Text.duration(null)).toBe('');
      expect(Text.duration([])).toBe('');
      expect(Text.duration(456)).toBe('456');
      expect(Text.duration({})).toBe('[object Object]');
      expect(Text.duration(NaN)).toBe('NaN');
    });
  });

  describe('>> filesize replacement method', () => {
    test('should replace bytes with readable filesizes', () => {
      expect(Text.filesize('please wait {filesize:1}')).toBe('please wait 1 B');
      expect(Text.filesize('please wait {filesize:1024}')).toBe('please wait 1 KB');
      expect(Text.filesize('please wait {filesize:5242880}')).toBe('please wait 5 MB');
      expect(Text.filesize('please wait {filesize:17179869184‬}          ')).toBe('please wait 16 GB');
      expect(Text.filesize('      please       wait {filesize:500000}          ')).toBe('please       wait 488.28 KB');
      expect(Text.filesize('please wait {filesize:}')).toBe('please wait ?');
      expect(Text.filesize('please wait {filesize:my ass}')).toBe('please wait ?');
      expect(Text.filesize()).toBe('');
      expect(Text.filesize(null)).toBe('');
      expect(Text.filesize([])).toBe('');
      expect(Text.filesize(456)).toBe('456');
      expect(Text.filesize({})).toBe('[object Object]');
      expect(Text.filesize(NaN)).toBe('NaN');
    });
  });

  describe('>> capitalization + replacement', () => {
    test('should capitalize and replace strings', () => {
      const replace = s => Text.capitalize(Text.duration(s));
      const replace2 = s => Text.capitalize(Text.filesize(s));
      expect(replace('please wait {duration:5000} to advance.')).toBe('Please wait 5 seconds to advance.');
      expect(replace('    the next round starts in {duration:120000}!')).toBe('The next round starts in 2 minutes!');
      expect(replace('the ETA is {duration:undefined}')).toBe('The ETA is ?');
      expect(replace('your nExt free spin is in {duration:3600000}    ')).toBe('Your nExt free spin is in 1 hour');
      //
      expect(replace2('please download {filesize:5000} to advance.')).toBe('Please download 4.88 KB to advance.');
      expect(replace2("    the next picture's size is {filesize:120000}!")).toBe(
        "The next picture's size is 117.19 KB!",
      );
      expect(replace2('remaining {filesize:undefined}')).toBe('Remaining ?');
      expect(replace2('frEe space in drIve: {filesize:36000000000}    ')).toBe('FrEe space in drIve: 33.53 GB');
    });

    test('should capitalize all words and replace strings', () => {
      const replace = s => Text.capitalizeAll(Text.duration(s));
      const replace2 = s => Text.capitalizeAll(Text.filesize(s));
      expect(replace('please wait {duration:5000} to advance.')).toBe('Please Wait 5 Seconds To Advance.');
      expect(replace('    the next round starts in {duration:120000}!')).toBe('The Next Round Starts In 2 Minutes!');
      expect(replace('the ETA is {duration:undefined}')).toBe('The ETA Is ?');
      expect(replace('your nExt free spin is in {duration:3600000}    ')).toBe('Your NExt Free Spin Is In 1 Hour');
      //
      expect(replace2('please download {filesize:5000} to advance.')).toBe('Please Download 4.88 KB To Advance.');
      expect(replace2("    the next picture's size is {filesize:120000}!")).toBe(
        "The Next Picture's Size Is 117.19 KB!",
      );
      expect(replace2('remaining {filesize:undefined}')).toBe('Remaining ?');
      expect(replace2('frEe space in drIve: {filesize:36000000000}    ')).toBe('FrEe Space In DrIve: 33.53 GB');
    });

    test('should capitalize all words and replace multiple strings', () => {
      const replace = s => Text.capitalizeAll(Text.duration(Text.filesize(s)));
      expect(replace('the expected time to download this {filesize:120000} file is {duration:5000}.')).toBe(
        'The Expected Time To Download This 117.19 KB File Is 5 Seconds.',
      );
      //
      expect(
        replace(
          '    in the last {duration:1209600000} you downloaded {filesize:36000000000} of "cute anime girl" pictures.',
        ),
      ).toBe('In The Last 2 Weeks You Downloaded 33.53 GB Of "Cute Anime Girl" Pictures.');
    });
  });

  describe('>> line breaking', () => {
    test('should join arguments as a string with line breaks', () => {
      expect(Text.lines('First line', 'Second line')).toBe('First line\nSecond line');
      expect(Text.lines('First line', '')).toBe('First line');
      expect(Text.lines(' First line Second line ')).toBe('First line Second line');
      expect(Text.lines('\n', 'First line', '', 'Another line')).toBe('First line\n\nAnother line');
      expect(Text.lines('\n', 'First line', '\n\n', 'Another line', '\n\n')).toBe('First line\n\nAnother line');
      expect(Text.lines('\n')).toBe('');
      expect(Text.lines(123)).toBe('123');
      expect(Text.lines(NaN, 'has', 123, 'apples')).toBe('NaN\nhas\n123\napples');
      expect(Text.lines({})).toBe('[object Object]');
      expect(Text.lines(null, 123)).toBe('null\n123');
    });
  });

  describe('>> number extraction', () => {
    test('should return an empty array for invalid inputs', () => {
      expect(Text.numbers(' ')).toEqual([]);
      expect(Text.numbers('')).toEqual([]);
      expect(Text.numbers('.')).toEqual([]);
      expect(Text.numbers()).toEqual([]);
      expect(Text.numbers(null)).toEqual([]);
      expect(Text.numbers({})).toEqual([]);
      expect(Text.numbers('Infinity')).toEqual([]);
      expect(Text.numbers('NaN')).toEqual([]);
      expect(Text.numbers(NaN)).toEqual([]);
      expect(Text.numbers(123)).toEqual([]);
    });

    test('should extract numbers from string', () => {
      expect(Text.numbers('0')).toEqual([0]);
      expect(Text.numbers('0.0')).toEqual([0.0]);
      expect(Text.numbers('.0')).toEqual([0.0]);
      expect(Text.numbers('0.000001')).toEqual([0.000001]);
      expect(Text.numbers('123')).toEqual([123]);
      expect(Text.numbers('123,4')).toEqual([123, 4]);
      expect(Text.numbers('123 4')).toEqual([123, 4]);
      expect(Text.numbers('123.4')).toEqual([123.4]);
      expect(Text.numbers('123.')).toEqual([123]);
      expect(Text.numbers('.4')).toEqual([0.4]);
      expect(Text.numbers('1......4')).toEqual([1, 4]);
      expect(Text.numbers('1,,,,,,,,,4')).toEqual([1, 4]);
      expect(Text.numbers('123!!!!!7897 >>>>>28')).toEqual([123, 7897, 28]);
      expect(Text.numbers('[123,12,22]: 28 (14) **99** (0 )0 1_2')).toEqual([123, 12, 22, 28, 14, 99, 0, 0, 1, 2]);
      expect(Text.numbers('!randomnumber min 25 max 88')).toEqual([25, 88]);
      expect(Text.numbers('!randomnumber min -100 max 100')).toEqual([-100, 100]);
      expect(Text.numbers('0[object Object]-4[object Object]')).toEqual([0, -4]);
    });

    test('should handle plus and minus signs', () => {
      expect(Text.numbers('+123')).toEqual([123]);
      expect(Text.numbers('-123')).toEqual([-123]);
      expect(Text.numbers('+-123')).toEqual([-123]);
      expect(Text.numbers('-+123')).toEqual([-123]);
      expect(Text.numbers('+123+123')).toEqual([123, 123]);
      expect(Text.numbers('-+++++++123')).toEqual([-123]);
      expect(Text.numbers('+--------123')).toEqual([-123]);
      expect(Text.numbers('+++123')).toEqual([123]);
      expect(Text.numbers('-- 123 123 -+123 -123 +123 - - - 123')).toEqual([123, 123, -123, -123, 123, 123]);
    });
  });
});
