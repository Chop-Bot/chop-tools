const Collection = require('@discordjs/collection');

/**
 * Stores guilds and channels where to ignore listeners.
 * @since v0.0.2
 */
class ListenerIgnoreList {
  constructor(client) {
    this.client = client;
    this.guilds = new Collection();
    this.channels = new Collection();
  }

  /**
   * Clears all timeouts then clears the lists.
   *
   * @memberof ListenerIgnoreList
   */
  clear() {
    const clearTimeout = ignored => (ignored.timeout ? this.client.clearTimeout(ignored.timeout) : null);
    this.guilds.forEach(clearTimeout);
    this.guilds.clear();
    this.channels.forEach(clearTimeout);
    this.channels.clear();
  }

  /**
   * Adds a channel to the ignore list.
   *
   * @param {string|string[]} id
   * @param {number} [duration=0]
   * @returns
   * @memberof ListenerIgnoreList
   */
  ignoreChannel(id, duration = 0) {
    if (Array.isArray(id)) {
      id.forEach(i => this.ignoreChannel(i, duration));
      return;
    }
    if (this.channels.has(id) && this.channels.get(id).timeout) {
      this.client.clearTimeout(this.channels.get(id).timeout);
    }
    this.channels.set(id, {
      start: Date.now(),
      duration,
      timeout: duration ? this.client.setTimeout(() => this.channels.delete(id), duration) : null,
    });
  }

  /**
   * Adds a guild to the ignore list.
   *
   * @param {string|string[]} id
   * @param {number} [duration=0]
   * @returns
   * @memberof ListenerIgnoreList
   */
  ignoreGuild(id, duration = 0) {
    if (Array.isArray(id)) {
      id.forEach(i => this.ignoreGuild(i, duration));
      return;
    }
    if (this.guilds.has(id) && this.guilds.get(id).timeout) {
      this.client.clearTimeout(this.guilds.get(id).timeout);
    }
    this.guilds.set(id, {
      start: Date.now(),
      duration,
      timeout: duration ? this.client.setTimeout(() => this.guilds.delete(id), duration) : null,
    });
  }

  /**
   * Removes a channel from the ignore list.
   *
   * @param {string|string[]} id
   * @memberof ListenerIgnoreList
   */
  listenChannel(id) {
    if (Array.isArray(id)) {
      id.forEach(this.listenChannel);
    }
    if (this.channels.has(id)) {
      const { timeout } = this.channels.get(id);
      if (timeout) this.client.clearTimeout(timeout);
      this.channels.delete(id);
    }
  }

  /**
   * Removes a guild from the ignore list.
   *
   * @param {string|string[]} id
   * @memberof ListenerIgnoreList
   */
  listenGuild(id) {
    if (Array.isArray(id)) {
      id.forEach(this.listenGuild);
    }
    if (this.guilds.has(id)) {
      const { timeout } = this.guilds.get(id);
      if (timeout) this.client.clearTimeout(timeout);
      this.guilds.delete(id);
    }
  }
}

module.exports = ListenerIgnoreList;
