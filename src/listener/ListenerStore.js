const { Client } = require('discord.js');
const Collection = require('@discordjs/collection');

const ListenerIgnoreList = require('./ListenerIgnoreList');

/**
 * Stores listeners.
 * @extends {external:Collection}
 * @since v0.0.2
 */
class ListenerStore extends Collection {
  constructor(client, listeners) {
    if (!client || !(client instanceof Client || client.prototype instanceof Client)) {
      throw new Error('ListenerStore requires a client');
    }

    const makeName = words => Array.isArray(words) ? words.join(' ').toLowerCase() : words.toLowerCase();
    
    const mappedListeners = listeners
      .map(l => [makeName(l.words), Object.assign(l, { name: makeName(l.words) })])
      .map(l => Object.defineProperty(l, 'client', { value: client }));

    super(mappedListeners);

    Reflect.defineProperty(this, 'ignored', { value: new ListenerIgnoreList(client), writable: false });

    this.client = client;
  }
}

module.exports = ListenerStore;
