/**
 * Runs listeners in Chop.
 * @since v0.0.2
 */
class ListenerRunner {
  /**
   * @param {ChopClient} client The client that instantiated this class.
   * @param {ChopOptions} options The configuration object.
   */
  constructor(client, options) {
    this.client = client;
    this.options = options;

    this.mappedListeners = {};
    this.client.listeners.forEach(l => {
      const c = l.category || 'other';
      this.mappedListeners[c] = [...(this.mappedListeners[c] || []), l];
      this.mappedListeners[c].sort((a, b) => a.priority - b.priority);
    });
  }

  /**
   * Makes the bot start listening for trigger messages.
   * @memberof ListenerRunner
   */
  listen() {
    this.client.on('message', message => {
      if (message.author.bot) return;

      if (this.client.listeners.ignored.guilds.has(message.guild.id)) return;
      if (this.client.listeners.ignored.channels.has(message.channel.id)) return;

      if (!this.client.listeners.size) return;

      // if a listener in a category returns true, skip to the next category
      Object.entries(this.mappedListeners).forEach(async ([category, listenersInThisCategory]) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const listener of listenersInThisCategory) {
          let result;
          try {
            const evaluation = listener.evaluate(message);
            // eslint-disable-next-line no-await-in-loop
            result = evaluation instanceof Promise ? await evaluation : evaluation;
          } catch (e) {
            this.client.emit('error', e);
            break;
          }
          if (result === true) {
            this.client.emit(
              'debug',
              `Skipping listeners in the "${listener.category}" category because "${listener.name}" returned true. ` +
                `Current iteration: (${category})`,
            );
            break;
          }
        }
      });
    });
  }
}

module.exports = ListenerRunner;
