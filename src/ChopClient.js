const Discord = require('discord.js');

const FileLoader = require('./FileLoader');
const Configuration = require('./Configuration');
const Task = require('./structures/Task');
const Schedule = require('./structures/Schedule');
const Command = require('./structures/Command');
const CommandStore = require('./stores/CommandStore');
const CommandRunner = require('./command/CommandRunner');
const Listener = require('./listener/Listener');
const ListenerStore = require('./listener/ListenerStore');
const ListenerRunner = require('./listener/ListenerRunner');
const Util = require('./util/Util');

/**
 * The discord.js Client class.
 * @external Client
 * @see {@link https://discord.js.org/#/docs/main/master/class/Client|Client}
 */

/**
 * The discord.js Client class.
 * @external ClientOptions
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/ClientOptions|ClientOptions}
 */

/**
 * The starting point of any Chop bot.
 * @namespace
 * @extends {external:Client}
 * @tutorial Getting Started
 * @since v0.0.1
 */
class ChopClient extends Discord.Client {
  /**
   * @param {external:ClientOptions} options Options for the client.
   * @example
   * const client = new ChopClient();
   */
  constructor(options = {}) {
    if (!Util.isObject(options)) throw new Error('Options must be an object.');
    const mergedConfig = Configuration.getConfig(options);
    super(mergedConfig);

    const fileLoader = new FileLoader(this, this.options.root);

    const commands = fileLoader.loadDirectorySync({
      dir: 'commands',
      importClass: Command,
      makeDir: true,
    });
    /**
     * A map of the commands loaded mapped by their name.
     * @name ChopClient#commands
     * @type {CommandStore}
     */
    this.commands = new CommandStore(this, commands);
    this._commandRunner = new CommandRunner(this, this.options);

    const tasks = fileLoader.loadDirectorySync({
      dir: 'tasks',
      importClass: Task,
      makeDir: true,
    });
    /**
     * The Schedule instance that will manage the tasks.
     * @name ChopClient#schedule
     * @type {Schedule}
     */
    this.schedule = new Schedule(this, tasks);

    const listeners = fileLoader.loadDirectorySync({
      dir: 'listeners',
      importClass: Listener,
      makeDir: true,
    });
    /**
     * A map of listeners loaded.
     * @name ChopClient#listeners
     * @type {Schedule}
     */
    this.listeners = new ListenerStore(this, listeners);
    this._listenerRunner = new ListenerRunner(this);

    this.use = (...args) => this._commandRunner.use(...args);
  }

  async login(token, { skipCommandRunner, skipListenerRunner }) {
    // TODO: For the love of all gods, make this async!
    // FIXME: PLEASE.
    if (!skipCommandRunner) {
      this._commandRunner.listen();
    }
    if (!skipListenerRunner) {
      this._listenerRunner.listen();
    }
    this.emit('debug', `Loaded ${this.commands.size} commands.`);
    this.emit('debug', `Loaded ${this.schedule.tasks.size} tasks.`);
    this.emit('debug', `Loaded ${this.listeners.size} listeners.`);
    return super.login(token);
  }

  async destroy(...args) {
    this.schedule.tasks.forEach(t => t.job.cancel());
    return super.destroy(...args);
  }
}

module.exports = ChopClient;
