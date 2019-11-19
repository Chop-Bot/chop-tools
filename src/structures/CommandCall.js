const { findBestMatch } = require('string-similarity');

/**
 * Represents a command call.
 * @property {string} caller The id of the user that made the call.
 * @property {string} callerTag The tag of the user that made the call.
 * @property {Command} command The command for this call.
 * @property {string} commandName The command name.
 * @property {boolean} commandExists Wether the command exists.
 * @property {string} bestMatch The command with best matching name.
 * @property {string[]} args The arguments the command was called with.
 * @property {boolean} hasEnoughArgs Wether the call has enough arguments.
 * @property {string} missingArg The first missing argument if not enough arguments.
 * @property {boolean} isDM Was the command called from a dm?
 * @property {boolean} isBot Did a bot call this command?
 * @property {boolean} isAdmin Does the caller have admin permission?
 * @property {boolean} isSuperUser Is the caller a super user?
 * @property {boolean} isAlias Was the command called through an alias?
 * @property {external:Message} message The message associated with this call.
 * @property {Date} time When the command was called.
 */
class CommandCall {
  constructor(client, message) {
    this.client = client;

    // Known
    this.caller = message.author.id;
    this.callerTag = message.author.tag;
    this.isSuperUser = this.client.options.owners.includes(this.caller);
    this.isAdmin =
      this.isSuperUser ||
      (message.member && message.member.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true }));
    this.isDM = message.channel.type !== 'text';
    this.isBot = message.author.bot;
    this.message = message;
    this.time = new Date();
    // Not known
    this.command = null;
    this.commandName = null;
    this.commandExists = null;
    this.isAlias = null;
    this.args = null;
    this.hasEnoughArgs = null;
    this.missingArg = null;
    this.bestMatch = null;

    this.parseAndSave(message);
  }

  /**
   * Parses the message for the command name and args.
   * @param {external:Message} message The message to be parsed.
   * @returns {CommandCall} The parsed command call.
   */
  parseAndSave(message) {
    // This assumes the prefix has already been checked
    const args = this.splitArguments(message.content).slice(1);
    let name = args.shift();
    name = name ? name.toLowerCase() : null;
    this.args = args;

    const find = this.findCommand(name);

    if (find.command) {
      this.isAlias = find.isAlias;
      this.command = find.command;
      this.commandName = this.command.name.toLowerCase();
      this.commandExists = true;
      this.hasEnoughArgs = true;
      if (this.command.args && this.command.args.length > 0) {
        if (this.args.length < this.command.args.length) {
          this.hasEnoughArgs = false;
          this.missingArg = this.command.args[this.args.length];
        }
      }
      if (this.client.options.findBestMatch && this.command.hidden) {
        const nonHidden = this.client.commands.map((cmd, cmdName) => (cmd.hidden ? null : cmdName)).filter(c => !!c);
        const secondBestMatch = findBestMatch(name, nonHidden)
          .ratings.slice()
          .sort((a, b) => a.rating - b.rating)[1];
        this.bestMatch = secondBestMatch ? secondBestMatch.target : null;
      }
    } else {
      this.commandExists = false;
      if (this.client.options.findBestMatch && name) {
        const nonHidden = this.client.commands.map((cmd, cmdName) => (cmd.hidden ? null : cmdName)).filter(c => !!c);
        const best = findBestMatch(name, nonHidden).bestMatch.target;
        this.bestMatch = best;
      }
    }
  }

  findCommand(name) {
    const command = this.client.commands.get(name);
    const alias = this.client.commands.find(c => c.aliases && c.aliases.map(a => a.toLowerCase()).includes(name));
    if (command) {
      return {
        command,
        isAlias: false,
      };
    }
    if (alias) {
      return {
        command: alias,
        isAlias: true,
      };
    }
    return { command: null, isAlias: false };
  }

  splitArguments(content, argNum) {
    const args = content
      .trim()
      .replace(/(\s\s+|\n)/g, ' ')
      .split(/ +/);
    if (!argNum || Number.isNaN(Number(argNum))) {
      return args;
    }
    const result = [];
    const max = Math.round(Number(argNum));
    for (let i = 0; i < max; i++) {
      if (i < max) {
        result.push(args[i] || null);
      } else {
        // If we are at the last argNum, treat the rest of the content as one argument
        result.push(args.slice(i).join('') || null);
      }
    }
    return result;
  }
}

module.exports = CommandCall;
