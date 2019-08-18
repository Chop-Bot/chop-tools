const Command = require('../structures/Command');

module.exports = new Command({
  name: 'help',
  description: 'Need some help?',
  usage: '[command name]',
  aliases: ['h'],
  async run(message, args) {
    message.channel.send('Need sum help m8?');
  },
});
