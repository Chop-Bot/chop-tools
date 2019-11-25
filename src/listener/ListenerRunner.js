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

      try {
        if (!this.client.listeners.size) return;

        // if a listener in a category returns true, skip to the next category
        Object.entries(this.mappedListeners).forEach(async ([category, listeners]) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const listener of listeners) {
            try {
              let result;
              const evaluation = listener.evaluate(message);
              if (evaluation instanceof Promise) {
                // eslint-disable-next-line no-await-in-loop
                result = await evaluation;
              } else {
                result = evaluation;
              }
              if (result) {
                this.client.emit(
                  'debug',
                  `Skipping listeners in the "${listener.category}" category because "${listener.name}" triggered. ` +
                    `Current loop: (${category})`,
                );
                break;
              }
            } catch (e) {
              this.client.emit('error', e);
              break;
            }
          }
        });
      } catch (e) {
        this.client.emit('error', e);
      }
    });
  }
}

module.exports = ListenerRunner;
