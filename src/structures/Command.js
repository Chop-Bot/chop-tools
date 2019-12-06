const Joi = require('@hapi/joi');
const merge = require('lodash.merge');

// TODO: Get rid of this nasty validation
const commandSchema = Joi.object()
  .keys({
    name: Joi.string()
      .regex(/^[a-zA-Z0-9_-]+$/, 'name')
      .min(1),
    description: Joi.string()
      .required()
      .min(1),
    usage: Joi.string().min(1),
    example: Joi.string().min(1),
    examples: Joi.array().items(Joi.string().min(1)),
    help: Joi.string().min(1),
    category: Joi.string()
      .alphanum()
      .min(1),
    aliases: Joi.array().items(
      Joi.string()
        .regex(/^[a-zA-Z0-9_-]+$/, 'name')
        .min(1),
    ),
    permissions: Joi.array().items(Joi.number()),
    cooldown: Joi.number().min(0),
    hidden: Joi.bool(),
    admin: Joi.bool(),
    delete: Joi.bool(),
    runIn: Joi.array()
      .min(1)
      .items(Joi.string().valid('text', 'dm')),
    args: Joi.array().items(Joi.string()),
    run: Joi.func(),
  })
  .requiredKeys('', 'name', 'description', 'runIn');

/**
 * @typedef {Function} CommandExecutor
 * @param {external:Message} message The message that called this command.
 * @param {string[]} args The args this command was called with.
 * @param {CommandCall} call The command call object.
 */

/**
 * @typedef {Object} CommandOptions
 * @property {string} name The command name.
 * @property {string} description The command description.
 * @property {string} usage How to use the command. Will appear as (prefix)(command name)(usage). Ex: !hello [name] if usage is "[name]"
 * @property {string} [example] An example of the command being used.
 * @property {string[]} [examples] An example of the command being used.
 * @property {string} help The text displayed when the user uses help [command name].
 * @property {string} category The category to which this command belongs.
 * @property {string[]} aliases Alternative names for this command.
 * @property {number[]} [permissions=[]] The permissions for this command.
 * @property {number} [cooldown=3] The cooldown in seconds for this command.
 * @property {string[]} [runIn=['text']] Where to allow this command to be used. Options: 'text' and 'dm'
 * @property {boolean} [hidden=false] Only users set in the owners config will be able to use this command.
 * @property {string[]} [args=[]] The commands this command takes. (Mostly for formatting the error message.)
 * @property {boolean} [delete=false] Wether the message that called this command should be deleted. Note: bot needs the appropriate permissions.
 * @property {CommandExecutor} run The function that will be executed when the command is called.
 * @since v0.0.2
 */

/**
 * Represents a command.
 * @property {string} name The command name.
 * @property {string} description The command description.
 * @property {string} usage How to use the command. Will appear as (prefix)(command name)(usage). Ex: !hello [name] if usage is "[name]"
 * @property {string} [example] An example of the command being used.
 * @property {string[]} [examples] An example of the command being used.
 * @property {string} help The text displayed when the user uses help [command name].
 * @property {string} category The category to which this command belongs.
 * @property {string[]} aliases Alternative names for this command.
 * @property {number[]} [permissions=[]] The permissions for this command.
 * @property {number} [cooldown=3] The cooldown in seconds for this command.
 * @property {string[]} [runIn=['text']] Where to allow this command to be used. Options: 'text' and 'dm'
 * @property {boolean} [hidden=false] Only users set in the owners config will be able to use this command.
 * @property {string[]} [args=[]] The commands this command takes. (Mostly for formatting the error message.)
 * @property {boolean} [delete=false] Wether the message that called this command should be deleted. Note: bot needs the appropriate permissions.
 * @property {CommandExecutor} run The function that will be executed when the command is called.
 * @property {ChopClient} client The client that instantiated this command.
 * @tutorial 02 - Creating Commands
 * @since v0.0.1
 * @example
 * const { Command } = require('chop-tools');
 *
 * module.exports = new Command({
 *   name: 'hello',
 *   description: 'Says hello back to you.',
 *   category: 'greeting',
 *   aliases: ['hi'],
 *   run(message, args, call) {
 *     message.channel.send(`Hello ${message.author}!`);
 *   },
 * });
 */
class Command {
  /**
   * @param {CommandOptions} options={} The options for this command.
   * @memberof Command
   */
  constructor(options = {}) {
    const defaults = {
      aliases: [],
      permissions: [],
      cooldown: 3,
      runIn: ['text'],
      hidden: false,
      args: [],
      delete: false,
    };
    const merged = merge(defaults, options);
    commandSchema.validate(merged, (err, value) => {
      if (err) throw err;
      Object.assign(this, value);
    });
  }
}

module.exports = Command;
