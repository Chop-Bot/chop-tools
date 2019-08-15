class CommandRunner {
  constructor(client, options) {
    /**
     * The client that instantiated this class.
     * @type {ChopClient}
     */
    this.client = client;
  }

  use() {}

  parseMessage() {}

  listen() {}
}

/*
class Command {
  constructor(
    client,
    {
      prefix = '>>',
      superUser = '',
      showCommandNotFoundMessage = false,
      directMessageCommands = 'ignore',
      dmHelp = true,
      typescript = false,
    },
    cmdDir
  ) {
    this._client = client;
    this._config = {
      prefix,
      superUser,
      showCommandNotFoundMessage,
      directMessageCommands,
      dmHelp,
      typescript,
    };
    this._middleware = [];

    // Error Handler
    this._onError = (message, command, error) => {
      console.error('[Discord] COMMAND ERROR ---');
      console.error('Error: ' + error.message);
      console.error('User: ' + message.author.username);
      console.error('Command: ' + command.name);
      console.error('Stack Trace: ');
      console.error(error);
      message.channel.send(
        ':x: There was an error trying to execute that command!'
      );
    };

    // COMMANDS HANDLER
    client.commands = new Collection();
    client.cooldowns = new Collection();

    // Gets all .js files in the commands folder and its subfolders ignoring files that start with _
    const cmdFiles = getAllFiles(cmdDir, {
      typescript: this._config.typescript,
    });

    for (const file of cmdFiles) {
      const command = require(file.replace(__dirname, './'));
      client.commands.set(command.name, command);
    }
  }

  changePrefix(newPrefix) {
    this._config.prefix = newPrefix.trimStart();
  }

  getCommandList() {
    return Array.from(this._client.commands.keys());
  }

  use(middleware) {
    if (isValidMiddleware(middleware)) {
      this._middleware.push(middleware);
    } else {
      throw new Error('Invalid middleware');
    }
  }

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
