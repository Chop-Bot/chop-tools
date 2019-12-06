const Collection = require('@discordjs/collection');
const Command = require('../src/structures/Command');

const commands = new Collection();

commands.set('hello', new Command({ name: 'hello', description: 'hi', aliases: ['greeting'], run() {} }));
commands.set('bye', new Command({ name: 'bye', description: 'bye', args: ['action'], run() {} }));
commands.set('candy', new Command({ name: 'candy', description: 'candyyy', run() {} }));
commands.set(
  'complicated',
  new Command({ name: 'candy', description: 'candyyy', args: ['first', 'second', 'third'], run() {} }),
);

// console.log(commands);

exports.createMockClient = prefix => {
  return {
    options: { prefix, owners: ['123'] },
    commands,
  };
};

exports.clients = {
  base: {
    options: { prefix: '!', owners: ['123'] },
    commands,
  },
};

exports.createMockMessage = content => {
  return {
    content,
    author: {
      id: '123',
      tag: 'tester#1234',
      username: 'tester',
      nickname: 'testy',
      bot: false,
    },
    member: { hasPermission: () => true },
    guild: {},
    channel: {
      type: 'text',
    },
  };
};

exports.messages = {
  ListenerCall: [
    {
      author: {
        id: '123',
        tag: 'tester#1234',
        username: 'tester',
        nickname: 'testy',
        bot: false,
      },
      member: { hasPermission: () => true },
      guild: {},
      channel: {
        type: 'text',
      },
    },
    {
      author: {
        id: '999',
        tag: 'bloo#8888',
        username: 'bloo',
        nickname: 'Bloo',
        bot: true,
      },
      member: { hasPermission: () => false },
      guild: {},
      channel: {
        type: 'dm',
      },
    },
  ],
  CommandCall: [
    {
      content: '!hello world 123',
      author: {
        id: '123',
        tag: 'tester#1234',
        username: 'tester',
        nickname: 'testy',
        bot: false,
      },
      member: { hasPermission: () => true },
      guild: {},
      channel: {
        type: 'text',
      },
    },
    {
      content: '!bye i am going to outer space on a quest!',
      author: {
        id: '555',
        tag: 'blade#5555',
        username: 'blade',
        nickname: 'bladey',
        bot: false,
      },
      member: { hasPermission: () => false },
      guild: {},
      channel: {
        type: 'text',
      },
    },
    {
      content: '!doesnotexist sad',
      author: {
        id: '789',
        tag: 'SevenAteNine#2222',
        username: 'SevenAteNine',
        nickname: 'Seven',
        bot: true,
      },
      member: { hasPermission: () => true },
      guild: {},
      channel: {
        type: 'dm',
      },
    },
  ],
};
