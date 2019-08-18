const Joi = require('@hapi/joi');
const merge = require('lodash.merge');

const commandSchema = Joi.object()
  .keys({
    name: Joi.string()
      .regex(/^[a-zA-Z0-9_-]+$/, 'name')
      .min(1),
    description: Joi.string()
      .required()
      .min(1),
    usage: Joi.string().min(1),
    help: Joi.string().min(1),
    category: Joi.string()
      .alphanum()
      .min(1),
    aliases: Joi.array().items(
      Joi.string()
        .alphanum()
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
 * Represents a command.
 * @property {string} name The command name.
 * @property {string} description The command description.
 * @property {string} usage How to use the command.
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
 * @tutorial 02 - Commands
 * @since v0.0.1
 */
class Command {
  /**
   * @param {Object} options={} The options for this command.
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
