const { Client } = require('discord.js');
const Collection = require('@discordjs/collection');
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

    const mappedTasks = tasks
      .map(t => [t.name.toLowerCase(), Object.assign(t, { name: t.name.toLowerCase() })])
      .map(t => Object.defineProperty(t, 'client', { value: client }));

    super(mappedTasks);

    this.client = client;
  }
}

module.exports = TaskStore;
