const Middleware = require('./util/Middleware');

/**
 * @typedef CommandCall
 * @param {String} caller The id of the user that made the call.
 * @param {String} commandName The command name.
 * @param {String[]} args The arguments the command was called with.
 * @param {Date} time When the command was called.
 */

/**
 * Runs commands in Chop.
 */
class CommandRunner extends Middleware {
  /**
   * @param {ChopClient} client The client that instantiated this class.
   * @param {ClientOptions} options The configuration object. TODO: Make a new typedef for this
   */
  constructor(client, options) {
    super();
    /**
     * The client that instantiated this class.
     * @type {ChopClient}
     * @name CommandRunner#client
     */
    this.client = client;

    /**
     * The options for the CommandRunner.
     * @type {ClientOptions}
     * @name CommandRunner#options
     */
    this.options = options;
  }

  // Returns a CommandCall object or null
  parseMessage() {}

  /**
   * Handles command call errors.
   * @param {CommandCall} commandCall The command call that resulted in an error.
   */
  onError(error, commandCall) {
    this.client.emit('command error', { error, call: commandCall });
  }

  listen() {}
}

/*
class Command {
    // COMMANDS HANDLER
    client.cooldowns = new Collection();

  onError(errorHandler) {
    if (!errorHandler || typeof errorHandler !== 'function') {
      throw new Error('errorHandler must be a function');
    }
    this._onError = errorHandler;
  }

  ListenForCommands(cb) {
    const client = this._client;
    const { cooldowns } = this._client;

    client.on('message', message => {
      const {
        prefix,
        superUser,
        showCommandNotFoundMessage,
        directMessageCommands,
      } = this._config;

      // If message sent by bot or doesn't have prefix, return
      if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
      }

      // Isolate command name and arguments
      const commandRequest = { ...parseCommand(message.content, prefix) };

      // Use all middleware registered
      for (const middleware of this._middleware) {
        try {
          if (!middleware(commandRequest, message)) return;
        } catch (e) {
          console.error('An error ocurred in a middleware!');
          return;
        }
      }

      const { args, commandName, commandContent } = commandRequest;

      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );

      if (!command) {
        if (commandName === 'help') {
          helpCommand(message, args, this._config.prefix, this._config.dmHelp);
          return;
        }
        if (showCommandNotFoundMessage) {
          message.channel.send('I could not find that command.');
        }
        return;
      }

      // superUser can be a string or array
      const isSuperUser = superUser.includes(message.author.id);

      // If the command is hidden and user is not a super user return
      if (command.hidden && !isSuperUser) {
        if (showCommandNotFoundMessage) {
          message.channel.send('I could not find that command.');
        }
        return;
      }

      // TODO: message.member could be null if the user uses a command just after joining the server
      const hasAdminPermission =
        isSuperUser ||
        message.member.hasPermission('ADMINISTRATOR', false, true, true);

      if (command.admin && !hasAdminPermission) {
        if (showCommandNotFoundMessage) {
          message.channel.send('I could not find that command.');
        }
        return;
      }

      // Command requires arguments
      if (command.args && !args.length) {
        let reply = `You didn't provide arguments, ${message.author}!`;
        if (command.usage) {
          reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
            command.usage
          }\``;
        }
        return message.channel.send(reply);
      }

      if (message.channel.type !== 'text') {
        switch (directMessageCommands) {
          case 'error':
            return message.reply(`I can't execute commands inside DMs!`);
          case 'allow':
            if (command.guildOnly) {
              return message.reply(
                `I can't execute \`${command.name}\` inside DMs!`
              );
            }
            break;
          case 'ignore':
          default:
            return;
        }
      }

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }

      const cd = isInCooldown(command, cooldowns, message.author.id);
      if (cd) {
        message.channel.send(
          `Please wait ${cd} more second(s) before using the \`${
            command.name
          }\` command.`
        );
        return;
      }

      if (command.delete === true) message.delete();

      try {
        command.execute(message, args, commandContent, this._config);
      } catch (error) {
        this._onError(message, command, error);
      }
    });

    if (cb) {
      if (typeof cb === 'function') {
        cb(client.commands);
      } else {
        console.warn(
          'Type of callback must be function. Instead received: ' + typeof cb
        );
      }
    }
  }
}

module.exports = Command;
*/
