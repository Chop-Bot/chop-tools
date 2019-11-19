/**
 * @typedef {Object} ChopOptions
 * @property {string} prefix The prefix used for commands.
 * @property {string} [root=null] Path to the directory Chop will look for commands, tasks, etc...
 *                                If not set, Chop will use the directory where the client was instantiated.
 * @property {Boolean} [dmHelp=true] Should the help command send the command list through DMs?
 * @property {string[]} owners Super Users.
 * @property {Boolean} [showNotFoundMessage=false] Sends a command not found message if the prefix is used with an unknown command
 * @property {string} [dmCommands='ignore'] How to handle commands in direct messages. Can be one of `ignore`, `allow`, `error`.
 *                                          If it's set to `ignore` all commands in DMs will be ignored. If it's set to allow commands
 *                                          with 'dm' in their runIn property will be allowed. If it's set to `error` a "Cannot execute
 *                                          commands in DMs" message will be sent.
 * @property {boolean} [allowBots=false] Can other bots use commands?
 * @property {Boolean} [findBestMatch=false] If a command cannot be found try to look for a similar named command.
 * @property {number} [defaultCooldown=3] The default cooldown for commands in seconds.
 * @property {Boolean} [typescript=false] Set this to true if your project is using typescript. This is for the file loader.
 * @property {Object} botPermissions TBD
 * @property {Object} messages The default messages.
 * @property {string} message.commandNotFound The message to send when a command is not found.
 * @since v0.0.1
 */

exports.DEFAULT_CONFIG = {
  prefix: '',
  dmHelp: true,
  owners: [''],
  showNotFoundMessage: false,
  dmCommands: 'ignore',
  allowBots: false,
  findBestMatch: true,
  defaultCooldown: 3,
  typescript: false,
  botPermissions: {
    PLACEHOLDER: true,
  },
  messages: {
    commandNotFound: 'I could not find that command.',
    bestMatch: 'Did you mean **{0}**?',
    // 0: prefix, 1: command name, 2: command usage
    usageMessage: '```{0}{1} {2}``` To learn more about the **{1}** command use `{0}help {1}`',
    missingArgument: 'You are missing the **{0}** argument.',
    missingPermissions: 'You do not have enough permissions to use the **{0}** command.',
    directMessageError: 'I cannot execute commands in DMs!',
    directMessageErrorSpecific: 'I cannot execute the **{0}** command in DMs!',
    cooldown: 'Please wait **{0}** before using the **{1}** command again.',
  },
};

/**
 * The discord.js Message class.
 * @external Message
 * @see {@link https://discord.js.org/#/docs/main/master/class/Message|Message}
 */

exports.DEFAULT_COMMAND_OPTIONS = {
  aliases: [],
  permissions: [],
  cooldown: 3,
  runIn: ['text'],
  hidden: false,
  args: [],
  delete: false,
  run: () => {},
};
