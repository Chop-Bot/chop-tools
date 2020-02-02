const { findBestMatch } = require('string-similarity');

const Text = require('../util/Text');

/**
 * Represents a command call.
 * @property {string} caller The id of the user that made the call.
 * @property {string} callerTag The tag of the user that made the call.
 * @property {string} callerUsername The caller's username.
 * @property {string} callerNickname The caller's nickname if they have one.
 * @property {external:Guild} guild The caller's nickname if they have one.
 * @property {Command} command The command for this call.
 * @property {string} commandName The command name.
 * @property {boolean} commandExists Wether the command exists.
 * @property {string} bestMatch The command with best matching name.
 * @property {string} content The content after the command name. Or after the last argument if the command expects arguments.
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
  constructor(client, message, prefix) {
    this.client = client;
    this.prefix = prefix || client.options.prefix;

    // Known
    this.caller = message.author.id;
    this.callerTag = message.author.tag;
    this.callerUsername = message.author.username;
    this.callerNickname = message.author.nickname;
    this.guild = message.guild;
    this.isSuperUser = this.client.options.owners.includes(this.caller);
    this.isAdmin =
      this.isSuperUser ||
      (message.member && message.member.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true }));
    this.isDM = message.channel.type === 'dm';
    this.isBot = message.author.bot;
    this.message = message;
    this.time = new Date();
    // Not known
    this.command = null;
    this.commandName = null;
    this.commandExists = false;
    this.isAlias = false;
    this.args = null;
    this.hasEnoughArgs = false;
    this.missingArg = undefined;
    this.bestMatch = null;

    this.parseAndSave(message);
  }

  /**
   * Parses the message for the command name and args.
   * @param {external:Message} message The message to be parsed.
   * @returns {CommandCall} The parsed command call.
   */
  parseAndSave(message) {
    const { args, name } = Text.splitArguments(message.content, this.prefix);
    // const args = this.splitArguments(message.content).slice(1);
    // let name = args.shift();
    // name = name ? name.toLowerCase() : null;
    this.args = args;

    this.content = this.args.join(' ');

    const find = this.findCommand(name);

    if (find.command) {
      this.isAlias = find.isAlias;
      this.command = find.command;
      this.commandName = this.command.name.toLowerCase();
      this.commandExists = true;
      this.hasEnoughArgs = true;
      if (this.command.args) {
        if (this.command.args.length > 0) {
          this.content = this.args.slice(this.command.args.length).join(' ');
          if (this.args.length < this.command.args.length) {
            this.hasEnoughArgs = false;
            this.missingArg = this.command.args[this.args.length];
            this.content = '';
          }
        }
      } else {
        this.content = this.args.join(' ');
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
      // TODO: should content be reset if the command doesn't exist? it could still be used by middleware...
      this.content = '';
      if (this.client.options.findBestMatch && name) {
        const nonHidden = this.client.commands.map((cmd, cmdName) => (cmd.hidden ? null : cmdName)).filter(c => !!c);
        const best = findBestMatch(name, nonHidden).bestMatch.target;
        this.bestMatch = best;
      }
    }
  }

  findCommand(name) {
    const command = this.client.commands.get(name);
    if (command) {
      return {
        command,
        isAlias: false,
      };
    }
    const alias = this.client.commands.find(c => c.aliases && c.aliases.map(a => a.toLowerCase()).includes(name));
    if (alias) {
      return {
        command: alias,
        isAlias: true,
      };
    }
    return { command: null, isAlias: false };
  }
}

module.exports = CommandCall;
