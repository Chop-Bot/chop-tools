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
    super(commands);
    this.client = client;
  }
}

module.exports = CommandStore;
