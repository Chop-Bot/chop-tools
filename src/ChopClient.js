const Discord = require('discord.js');

const FileLoader = require('./files/FileLoader');
const ChopEvents = require('./structures/ChopEvents');
const Schedule = require('./structures/Schedule');
const Command = require('./structures/Command');
const Task = require('./structures/Task');
const Util = require('./util/Util');

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
   * const client = new ChopClient();
   * client.login('Your Token');
   */
  constructor(root = null, ...args) {
    super(...args);

    /**
     * Instance of ChopEvents that will manage the Chop events.
     * @name ChopClient#events
     * @type {ChopEvents}
     */
    this.events = new ChopEvents();

    const fileLoader = new FileLoader(this, root);

    const commands = fileLoader.loadDirectory({
      dir: 'commands',
      importClass: Command,
      makeDir: true,
    });

    /**
     * A map of the commands loaded mapped by their name.
     * @name ChopClient#commands
     * @type {Map<String, Command>}
     */
    this.commands = Util.mapByName(commands);

    console.log('Loaded', this.commands.size, 'commands.');

    const tasks = fileLoader.loadDirectory({
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

    console.log('Loaded', this.schedule.tasks.size, 'tasks.');
  }
}

module.exports = ChopClient;
