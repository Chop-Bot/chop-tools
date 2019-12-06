const ListenerCall = require('../src/structures/ListenerCall');
const mockerinos = require('./mockerinos');

const client = mockerinos.clients.base;
const message1 = mockerinos.messages.ListenerCall[0];
const message2 = mockerinos.messages.ListenerCall[1];

const listener = {};

describe('ListenerCall tests', () => {
  describe('>> property values', () => {
    const call1 = () => new ListenerCall(client, listener, message1);
    const call2 = () => new ListenerCall(client, listener, message2);
    test('caller property', () => {
      expect(typeof call1().caller).toBe('string');
      expect(call1().caller).toBe('123');
      expect(call2().caller).toBe('999');
    });
    test('callerTag property', () => {
      expect(typeof call1().callerTag).toBe('string');
      expect(call1().callerTag).toBe('tester#1234');
      expect(call2().callerTag).toBe('bloo#8888');
    });
    test('username property', () => {
      expect(typeof call1().callerUsername).toBe('string');
      expect(call1().callerUsername).toBe('tester');
      expect(call2().callerUsername).toBe('bloo');
    });
    test('nickname property', () => {
      expect(typeof call1().callerNickname).toBe('string');
      expect(call1().callerNickname).toBe('testy');
      expect(call2().callerNickname).toBe('Bloo');
    });
    test('isSuperUser property', () => {
      expect(typeof call1().isSuperUser).toBe('boolean');
      expect(call1().isSuperUser).toBe(true);
      expect(call2().isSuperUser).toBe(false);
    });
    test('isDM property', () => {
      expect(typeof call1().isDM).toBe('boolean');
      expect(call1().isDM).toBe(false);
      expect(call2().isDM).toBe(true);
    });
    test('isBot property', () => {
      expect(typeof call1().isBot).toBe('boolean');
      expect(call1().isBot).toBe(false);
      expect(call2().isBot).toBe(true);
    });
    test('isAdmin property', () => {
      expect(typeof call1().isAdmin).toBe('boolean');
      expect(call1().isAdmin).toBe(true);
      expect(call2().isAdmin).toBe(false);
    });
    test('time property', () => {
      expect(call1().time).toBeInstanceOf(Date);
      expect(call2().time).toBeInstanceOf(Date);
    });
  });
  describe('>> properties exist', () => {
    const createCall = () => new ListenerCall(client, listener, message1);
    test('should have a listener property', () => {
      expect(createCall().listener).toBe(listener);
      expect(createCall().listener).not.toBe({});
    });
    test('should have a client property', () => {
      expect(createCall().client).toBe(client);
      expect(createCall().client).not.toBe({});
    });
    test('should have a guild property', () => {
      expect(createCall().guild).toBe(message1.guild);
      expect(createCall().guild).not.toBe(message2.guild);
    });
    test('should have a message property', () => {
      expect(createCall().message).toBe(message1);
      expect(createCall().message).not.toBe(message2);
    });
  });
});
