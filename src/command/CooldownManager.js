const { Collection } = require('discord.js');
// const Command = require('../structures/Command');

/**
 * Stores commands.
 * @extends {external:Collection}
 */
class CooldownManager extends Collection {
  /**
   * Creates an instance of CooldownStore.
   * @param {ChopClient} client The client that instantiated this class.
   * @memberof CooldownStore
   */
  constructor(client) {
    super();
    if (!client) throw new Error('CooldownManager needs a client.');

    this.client = client;

    this.client.commands.forEach((cmd) => {
      super.set(cmd.name.toLowerCase(), new Collection());
    });
  }

  updateTimeLeft(commandName, userId) {
    if (!this.client.commands.has(commandName)) throw new Error(`Command ${commandName} not found.`);
    const now = Date.now();
    const timestamps = super.get(commandName);
    timestamps.set(userId, now);
  }

  getTimeLeft(commandName, userId) {
    if (!this.client.commands.has(commandName)) throw new Error(`Command ${commandName} not found.`);
    const cmd = this.client.commands.get(commandName);
    const now = Date.now();
    const cooldownAmount = (cmd.cooldown || 3) * 1000;
    const timestamps = super.get(commandName);
    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
        return timeLeft;
      }
      return 0;
    }
    this.updateTimeLeft(commandName, userId);
    this.client.setTimeout(() => timestamps.delete(userId), cooldownAmount);
    return 0;
  }

  refreshCommandList() {
    super.sweep(cmd => !this.client.commands.has(cmd.name));
    this.client.commands.forEach((cmd) => {
      if (!super.has(cmd.name)) super.set(cmd.name, new Collection());
    });
  }
}

module.exports = CooldownManager;
