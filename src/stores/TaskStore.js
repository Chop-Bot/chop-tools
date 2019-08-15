const { Collection, Client } = require('discord.js');
// const Task = require('../structures/Task');

/**
 * Stores tasks.
 * @extends {external:Collection}
 */
class TaskStore extends Collection {
  constructor(client, tasks) {
    if (!client || !(client instanceof Client || client.prototype instanceof Client)) {
      throw new Error('CommandStore requires a client');
    }
    super(tasks);
    this.client = client;
  }
}

module.exports = TaskStore;
