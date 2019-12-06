const CommandCall = require('../src/structures/CommandCall');
const Command = require('../src/structures/Command');
const mockerinos = require('./mockerinos');

const client = mockerinos.clients.base;
const createMockClient = mockerinos.createMockClient;
const createMockMessage = mockerinos.createMockMessage;
const message1 = mockerinos.messages.CommandCall[0];
const message2 = mockerinos.messages.CommandCall[1];
const message3 = mockerinos.messages.CommandCall[2];

describe('CommandCall tests', () => {
  describe('>> property values', () => {
    const call1 = () => new CommandCall(client, message1);
    const call2 = () => new CommandCall(client, message2);
    const call3 = () => new CommandCall(client, message3);
    const createCall = (c = client, m = message1) => new CommandCall(c, m);
    test('caller property', () => {
      expect(typeof call1().caller).toBe('string');
      expect(call1().caller).toBe('123');
      expect(call2().caller).toBe('555');
    });
    test('callerTag property', () => {
      expect(typeof call1().callerTag).toBe('string');
      expect(call1().callerTag).toBe('tester#1234');
      expect(call2().callerTag).toBe('blade#5555');
    });
    test('username property', () => {
      expect(typeof call1().callerUsername).toBe('string');
      expect(call1().callerUsername).toBe('tester');
      expect(call2().callerUsername).toBe('blade');
    });
    test('nickname property', () => {
      expect(typeof call1().callerNickname).toBe('string');
      expect(call1().callerNickname).toBe('testy');
      expect(call2().callerNickname).toBe('bladey');
    });
    test('command property finds command', () => {
      expect(call1().command).toBeInstanceOf(Command);
      expect(call3().command).toBeFalsy();
    });
    test('command property can parse prefix', () => {
      expect(createCall(createMockClient('!')).command).toBeInstanceOf(Command);
      expect(createCall(createMockClient('!p')).command).toBeFalsy();
    });
    test('commandName property', () => {
      expect(call1().commandName).toBe('hello');
      expect(call2().commandName).toBe('bye');
      expect(call3().commandName).toBeFalsy();
    });
    test('commandExists property', () => {
      expect(call1().commandExists).toBe(true);
      expect(call2().commandExists).toBe(true);
      expect(call3().commandExists).toBe(false);
    });
    test.todo('bestMatch property');
    test('content property', () => {
      // normal
      expect(createCall(client, mockerinos.createMockMessage('!hello there')).content).toBe('there');
      expect(createCall(client, mockerinos.createMockMessage('!candy swwet much?')).content).toBe('swwet much?');
      // inexistent command
      expect(createCall(client, mockerinos.createMockMessage('!hi cutie')).content).toBe('');
      expect(createCall(client, mockerinos.createMockMessage('!food my favorite food is spaghetti')).content).toBe('');
      // expects 1 arg
      expect(createCall(client, mockerinos.createMockMessage('!bye expects1arg')).content).toBe('');
      expect(createCall(client, mockerinos.createMockMessage('!bye wassup  my dudo')).content).toBe('my dudo');
    });
    test('args property', () => {
      expect(createCall(client, createMockMessage('!hello there friend')).args).toStrictEqual(['there', 'friend']);
      expect(createCall(client, createMockMessage('!hello')).args).toStrictEqual([]);
      expect(createCall(client, createMockMessage('!hello there')).args).toStrictEqual(['there']);
      expect(createCall(client, createMockMessage('!hi there friend')).args).toStrictEqual(['there', 'friend']);
      expect(createCall(client, createMockMessage('!bye there friend')).args).toStrictEqual(['there', 'friend']);
      expect(createCall(client, createMockMessage('!bye')).args).toStrictEqual([]);
    });
    test('hasEnoughArgs property', () => {
      expect(createCall(client, createMockMessage('!hello there friend')).hasEnoughArgs).toBe(true);
      expect(createCall(client, createMockMessage('!hello')).hasEnoughArgs).toBe(true);
      expect(createCall(client, createMockMessage('!hello there')).hasEnoughArgs).toBe(true);
      expect(createCall(client, createMockMessage('!hi there friend')).hasEnoughArgs).toBe(false);
      expect(createCall(client, createMockMessage('!bye there friend')).hasEnoughArgs).toBe(true);
      expect(createCall(client, createMockMessage('!bye')).hasEnoughArgs).toBe(false);
    });
    test('missingArg property', () => {
      // doesn't require args
      expect(createCall(client, createMockMessage('!hello')).missingArg).toBeUndefined();
      expect(createCall(client, createMockMessage('!hello there')).missingArg).toBeUndefined();
      expect(createCall(client, createMockMessage('!hello there friend')).missingArg).toBeUndefined();
      // doesn't exist
      expect(createCall(client, createMockMessage('!hi there friend')).missingArg).toBeUndefined();
      // requires arg
      expect(createCall(client, createMockMessage('!bye there friend')).missingArg).toBeUndefined();
      expect(createCall(client, createMockMessage('!bye')).missingArg).toBe('action');
      expect(createCall(client, createMockMessage('!complicated')).missingArg).toBe('first');
      expect(createCall(client, createMockMessage('!complicated 1')).missingArg).toBe('second');
      expect(createCall(client, createMockMessage('!complicated 1 2')).missingArg).toBe('third');
      expect(createCall(client, createMockMessage('!complicated 1 2 3')).missingArg).toBeUndefined();
    });
    test('isDM property', () => {
      expect(typeof call1().isDM).toBe('boolean');
      expect(call1().isDM).toBe(false);
      expect(call2().isDM).toBe(false);
      expect(call3().isDM).toBe(true);
    });
    test('isBot property', () => {
      expect(typeof call1().isBot).toBe('boolean');
      expect(call1().isBot).toBe(false);
      expect(call2().isBot).toBe(false);
      expect(call3().isBot).toBe(true);
    });
    test('isAdmin property', () => {
      expect(typeof call1().isAdmin).toBe('boolean');
      expect(call1().isAdmin).toBe(true);
      expect(call2().isAdmin).toBe(false);
      expect(call3().isAdmin).toBe(true);
    });
    test('isSuperUser property', () => {
      expect(typeof call1().isSuperUser).toBe('boolean');
      expect(call1().isSuperUser).toBe(true);
      expect(call2().isSuperUser).toBe(false);
    });
    test('isAlias property', () => {
      expect(typeof createCall(client, createMockMessage('!complicated 1 2 3')).isAlias).toBe('boolean');
      expect(typeof createCall(client, createMockMessage('!greeting HELLO')).isAlias).toBe('boolean');
      expect(createCall(client, createMockMessage('!complicated 1 2 3')).isAlias).toBe(false);
      expect(createCall(client, createMockMessage('!greeting HELLO')).isAlias).toBe(true);
    });
    test('time property', () => {
      expect(call1().time).toBeInstanceOf(Date);
      expect(call2().time).toBeInstanceOf(Date);
      expect(call3().time).toBeInstanceOf(Date);
    });
  });

  describe('>> properties exist', () => {
    const call = () => new CommandCall(client, message1);
    test('should have a client property', () => {
      expect(call().client).toBe(client);
    });
    test('should have a guild property', () => {
      expect(call().guild).toBe(message1.guild);
      expect(call().guild).not.toBe(message2.guild);
    });
    test('should have a message property', () => {
      expect(call().message).toBe(message1);
      expect(call().message).not.toBe(message2);
    });
  });
});
