const Discord = require('discord.js');

const FileLoader = require('./FileLoader');
const ChopEvents = require('./util/ChopEvents');
const Schedule = require('./structures/Schedule');
const CommandStore = require('./stores/CommandStore');
const Command = require('./structures/Command');
const Task = require('./structures/Task');
const Util = require('./util/Util');

const DEFAULTS = { root: require.main.path };

/**
 * The discord.js Client class.
 * @external Client
 * @see {@link https://discord.js.org/#/docs/main/master/class/Client|Client}
 */

/**
 * The starting point of any Chop bot.
 * @namespace
 * @extends {external:Client}
 */
class ChopClient extends Discord.Client {
  /**
   * @param {String} root Path to the directory Chop will look for commands, tasks, etc...
   * If not set, Chop will use the directory where the client was instantiated.
   * @param  {...any} args Arguments to pass to Discord.Client
   * @example
   * const client = new ChopClient('TOKEN');
   */
  constructor(options = {}) {
    // eslint-disable-next-line no-param-reassign
    options = { ...DEFAULTS, ...options };
    super(options);
    this.root = options.root;

    /**
     * Instance of ChopEvents that will manage the Chop events.
     * @name ChopClient#events
     * @type {ChopEvents}
     */
    this.events = new ChopEvents();

    const fileLoader = new FileLoader(this, this.root);

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
    this.commands = new CommandStore(this, Util.mapByName(commands));
    this.emit('debug', 'Loaded', this.commands.size, 'commands.');

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
    this.schedule = new Schedule(this, Util.mapByName(tasks));
    this.emit('debug', 'Loaded', this.schedule.tasks.size, 'tasks.');
  }

  async login(token) {
    return super.login(token);
  }
}

module.exports = ChopClient;
