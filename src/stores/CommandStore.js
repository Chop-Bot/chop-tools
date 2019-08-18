const { Collection, Client } = require('discord.js');
// const Command = require('../structures/Command');

/**
 * Stores commands.
 * @extends {external:Collection}
 */
class CommandStore extends Collection {
  constructor(client, commands) {
    if (!client || !(client instanceof Client || client.prototype instanceof Client)) {
      throw new Error('CommandStore requires a client');
    }

    const mappedCommands = commands
      .map(c => [c.name.toLowerCase(), Object.assign(c, { name: c.name.toLowerCase() })])
      .map(c => Object.defineProperty(c, 'client', { value: client }));

    super(mappedCommands);

    this.client = client;
    // Add the default help command if the user haven't overwritten it yet
    if (!super.has('help')) {
      const helpCommand = module.require('../command/defaultHelpCommand.js');
      helpCommand.client = client;
      super.set('help', helpCommand);
    }
  }
}

module.exports = CommandStore;
