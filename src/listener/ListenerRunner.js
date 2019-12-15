/* eslint-disable no-inner-declarations */
/* eslint-disable no-loop-func */
const Text = require('../util/Text');
const Util = require('../util/Util');

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
      const channel = () => message.channel;
      if (message.author.bot) return;

      // When she first joins a server there may not be a guild object yet.
      if (!message.guild) {
        return;
      }
      if (this.client.listeners.ignored.guilds.has(message.guild.id)) return;
      if (this.client.listeners.ignored.channels.has(message.channel.id)) return;

      if (!this.client.listeners.size) return;

      function safeSend(...args) {
        const lines = [...args];
        const lastArg = Util.isObject(lines[lines.length-1]) ? lines.pop() : undefined;
        const msg = Text.lines(...lines, typeof lastArg === 'string' ? lastArg : '');

        return channel().send(msg, lastArg).then(() => {
          // throw new Error('This is for test')
        }).catch(err => {
          err.stack += `\n\nGuild: ${message.guild ? message.guild.name : undefined}\n`;
          err.stack += `Channel: ${message.channel ? message.channel.name : undefined}\n`;
          this.client.emit('error', err);
        });
      }

      const entries = Object.entries(this.mappedListeners);

      const runListenersInCategory = async (listenersInThisCategory) => {
        for (const listener of listenersInThisCategory) {
          // inject safe send
          listener.send = (...args) => safeSend(...args);
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
            break;
          }
        }
      }

      const runAllListeners = () => {
        for (const [category, listenersInThisCategory] of entries) {
          runListenersInCategory(listenersInThisCategory)
            .catch(console.log);
        }
      }

      runAllListeners();
    });
  }
}

module.exports = ListenerRunner;
