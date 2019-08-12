const Command = require('../src/command/Command');

describe('◽ Command tests >>', () => {
  test('should contain the correct defaults', () => {
    const cmd = new Command();
    expect(cmd).toMatchObject({
      aliases: [],
      permissions: [],
      cooldown: 3,
      runIn: ['text'],
      hidden: false,
      args: 0,
      delete: false,
    });
  });

  describe('◽ Validation tests >>', () => {
    test('should throw for invalid names', () => {
      const spawn = name => () => new Command({ name });
      expect(spawn('valid')).not.toThrow();
      expect(spawn('not alphanum')).toThrow('"Name" must only contain alpha-numeric characters');
      expect(spawn('not#alphanum')).toThrow('"Name" must only contain alpha-numeric characters');
      expect(spawn('---')).toThrow('"Name" must only contain alpha-numeric characters');
      expect(spawn('')).toThrow('"Name" is not allowed to be empty');
      expect(spawn(2)).toThrow('"Name" must be a string');
      expect(spawn([])).toThrow('"Name" must be a string');
      expect(spawn({})).toThrow('"Name" must be a string');
      expect(spawn(null)).toThrow('"Name" must be a string');
      expect(spawn()).toThrow('"Name" is required');
    });

    test('should throw for invalid descriptions', () => {
      const spawn = description => () => new Command({ description });
      expect(spawn('valid')).not.toThrow();
      expect(spawn('This is a perfectly valid command description.')).not.toThrow();
      expect(spawn('@#$%¨&*asjofbnioasjçn ``àaa`` lplpl .. 123456789')).not.toThrow();
      expect(spawn('')).toThrow('"Description" is not allowed to be empty');
      expect(spawn(2)).toThrow('"Description" must be a string');
      expect(spawn([])).toThrow('"Description" must be a string');
      expect(spawn({})).toThrow('"Description" must be a string');
      expect(spawn(null)).toThrow('"Description" must be a string');
      expect(spawn()).toThrow('"Description" is required');
    });

    test('should throw for invalid usages', () => {
      const spawn = usage => () => new Command({ usage });
      expect(spawn('valid')).not.toThrow();
      expect(spawn('This is a perfectly valid command usage.')).not.toThrow();
      expect(spawn('@#$%¨&*asjofbnioasjçn ``àaa`` lplpl .. 123456789')).not.toThrow();
      expect(spawn('')).toThrow('"Usage" is not allowed to be empty');
      expect(spawn(2)).toThrow('"Usage" must be a string');
      expect(spawn([])).toThrow('"Usage" must be a string');
      expect(spawn({})).toThrow('"Usage" must be a string');
      expect(spawn(null)).toThrow('"Usage" must be a string');
    });
  });
});
