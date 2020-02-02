const CommandCall = require('../structures/CommandCall');
const CooldownManager = require('./CooldownManager');
const CommandError = require('./CommandError');
const Middleware = require('./Middleware');
const MiddlewareError = require('./MiddlewareError');
const Util = require('../util/Util');
const Text = require('../util/Text');

/**
 * Runs commands in Chop.
 * @since v0.0.1
 */
class CommandRunner extends Middleware {
  /**
   * @param {ChopClient} client The client that instantiated this class.
   * @param {ChopOptions} options The configuration object.
   */
  constructor(client, options) {
    super();
    this.client = client;
    this.options = options;

    /**
     * The cooldown manager for this runner.
     * @type {CooldownManager}
     * @name CommandRunner#cooldowns
     */
    this.cooldowns = new CooldownManager(client);
  }

  /**
   * Makes the bot start listening for commands.
   * @memberof CommandRunner
   */
  listen() {
    this.client.on('message', message => this.onMessage(message));
  }

  onMessage(message, prefixMap) {
    const isPrefixed = this.validatePrefix(message, prefixMap);
    if (!isPrefixed || (message.author.bot && !this.options.allowBots)) return;

    const isDM = message.channel.type === 'dm';
    if (isDM && this.options.dmCommands === 'ignore') return;
    if (isDM && this.options.dmCommands === 'error') {
      this.sendMessage(message.channel, this.options.messages.directMessageError);
      return;
    }

    const call = new CommandCall(this.client, message, isPrefixed);

    if (!call.commandExists) {
      if (this.options.showNotFoundMessage) {
        this.sendMessage(message.channel, this.options.messages.commandNotFound);
        if (call.bestMatch) {
          message.channel.send(Util.format(this.options.messages.bestMatch, call.bestMatch));
        }
      }
      return;
    }

    if (call.isDM && !call.command.runIn.includes('dm')) {
      this.sendMessage(
        message.channel,
        Util.format(this.options.messages.directMessageErrorSpecific, call.commandName),
      );
      return;
    }

    try {
      this.go(call, commandCall => {
        this.run(message, commandCall);
      });
    } catch (e) {
      const error = new MiddlewareError('An error happened in a middleware.', call);
      error.stack += `\nORIGINAL STACK:\n${e.stack}`;
      this.client.emit('error', error);
    }
  }

  validatePrefix(message, prefixMap) {
    const content = message.content
      .trim()
      .toLowerCase()
      .replace(/\s\s+/g, ' ');

    if (!prefixMap) {
      return content.startsWith(this.options.prefix) ? this.options.prefix : false;
    }

    const guildId = message.guild.id;

    const prefix = prefixMap.get(guildId);

    // do not run command with normal prefix if a custom prefix is set
    if (prefix && content.startsWith(this.options.prefix)) {
      return false;
    }

    return prefix && content.startsWith(prefix) ? prefix : false;
  }

  /**
   * Runs a command call.
   * @param {external:Message} message The discord message for this command.
   * @param {CommandCall} call
   * @memberof CommandRunner
   */
  run(message, call) {
    if (call.command.hidden && !call.isSuperUser) {
      if (this.options.showNotFoundMessage) {
        this.sendMessage(message.channel, this.options.messages.commandNotFound);
        if (this.options.findBestMatch) {
          this.sendMessage(
            message.channel,
            Util.format(this.options.messages.bestMatch, call.bestMatch),
          );
        }
      }
      return;
    }

    if (call.command.admin && !call.isAdmin) {
      this.sendMessage(
        message.channel,
        Util.format(this.options.messages.missingPermissions, call.commandName),
      );
      return;
    }

    if (!call.hasEnoughArgs) {
      // TODO: Implement argument prompting
      this.sendMessage(
        message.channel,
        Util.format(this.options.messages.missingArgument, call.missingArg),
      );
      this.sendMessage(
        message.channel,
        Util.format(
          this.options.messages.usageMessage,
          this.options.prefix,
          call.command.name,
          call.command.usage || call.command.args.reduce((acc, cur) => `${acc}<${cur}> `, ''),
        ),
      );
      return;
    }

    const cooldownLeft = this.cooldowns.getTimeLeft(call.commandName, call.caller);

    if (cooldownLeft > 0) {
      this.sendMessage(
        message.channel,
        Util.format(
          this.options.messages.cooldown,
          Util.secondsToTime(cooldownLeft),
          call.commandName,
        ),
      );
      return;
    }

    this.cooldowns.updateTimeLeft(call.commandName, call.caller);

    const safeSend = (...args) => {
      const lines = [...args];
      const lastArg = lines.pop();
      const msg = Text.lines(...lines, typeof lastArg === 'string' ? lastArg : '');

      return message.channel.send(msg, Util.isObject(lastArg) ? lastArg : undefined).catch(err => {
        err.stack += `\n\nGuild: ${message.guild ? message.guild.name : undefined}\n`;
        err.stack += `Channel: ${message.channel ? message.channel.name : undefined}\n`;
        err.stack += `Command: ${call.commandName}\n`;
        // err.guild = message.guild; // big guild = big spam
        // err.channel = message.channel;
        this.client.emit('error', err);
      });
    };

    call.command.send = safeSend;

    if (call.command.delete) {
      message.delete({ reason: `Executed the ${call.commandName} command.` }).catch(() => {});
    }

    // Note to future self: Yes. You did this. Deal with it.
    const promiseErrorHack = (subject, args, normalErrorHandler) => {
      try {
        subject(...args).catch(normalErrorHandler);
      } catch (err) {
        if (err instanceof TypeError && /catch/.test(err.message)) {
          // This error is from the .catch() above
        } else {
          normalErrorHandler(err);
        }
      }
    };

    // haha fun
    promiseErrorHack(
      (...args) => call.command.run(...args),
      [message, call.args, call],
      err => this.client.emit('error', new CommandError(call.command, call, err)),
    );
  }

  /**
   * Tries to send a message. Emit warning if can't.
   * @param {Object} channel The channel to send the message to.
   * @param {string} content The message to be send.
   * @memberof CommandRunner
   */
  sendMessage(channel, content) {
    channel.send(content).catch(err => {
      this.client.emit('error', err);
    });
  }

  /**
   * Handles command call errors.
   * @param {CommandError} commandError The command error object.
   * @memberof CommandRunner
   */
  emitError(commandError) {
    this.client.emit('error', commandError);
  }
}

module.exports = CommandRunner;
