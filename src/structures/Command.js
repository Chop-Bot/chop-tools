const V = require('@hapi/joi');

// TODO: Turn this mess into a joi schema
const VALIDATION = {
  name: V.string()
    .required()
    .min(1)
    .alphanum()
    .label('Name'),
  description: V.string()
    .required()
    .label('Description'),
  usage: V.string()
    .optional()
    .label('Usage'),
  help: V.string()
    .optional()
    .label('Help'),
  aliases: V.array()
    .min(0)
    .items(V.string())
    .label('Aliases'),
  permissions: V.array()
    .min(0)
    .items(V.string())
    .label('Permissions'),
  cooldown: V.number()
    .required()
    .min(0)
    .label('Cooldown'),
  category: V.string()
    .optional()
    .label('Category'),
  runIn: V.array()
    .items(V.allow('text', 'dm'))
    .label('RunIn'),
  hidden: V.bool().label('Hidden'),
  args: V.number()
    .min(0)
    .label('Args'),
  delete: V.bool().label('Delete'),
  run: V.func()
    .required()
    .label('Run'),
};

const validateOrThrow = (value, validation) => {
  const result = validation.validate(value);
  if (result.error) {
    throw result.error;
  }
  return result.value;
};

/**
 * Represents a command.
 * @namespace
 */
class Command {
  constructor(options) {
    const defaults = {
      aliases: [],
      permissions: [],
      cooldown: 3,
      runIn: ['text'],
      hidden: false,
      args: 0,
      delete: false,
      run: () => {},
    };
    const fields = { ...defaults, ...options };
    // eslint-disable-next-line no-restricted-syntax
    for (const field in fields) {
      if (VALIDATION[field]) {
        this[`_${field}`] = validateOrThrow(fields[field], VALIDATION[field]);
      } else {
        throw new Error(`Field ${field} is not a valid command field.`);
      }
    }
  }

  set name(n) {
    this._name = validateOrThrow(n, VALIDATION.name);
  }

  get name() {
    return this._name;
  }

  setName(n) {
    this._name = validateOrThrow(n, VALIDATION.name);
    return this;
  }

  set description(n) {
    this._description = validateOrThrow(n, VALIDATION.description);
  }

  get description() {
    return this._description;
  }

  setDescription(n) {
    this._description = validateOrThrow(n, VALIDATION.description);
    return this;
  }

  set usage(n) {
    this._usage = validateOrThrow(n, VALIDATION.usage);
  }

  get usage() {
    return this._usage;
  }

  setUsage(n) {
    this._usage = validateOrThrow(n, VALIDATION.usage);
    return this;
  }

  set help(n) {
    this._help = validateOrThrow(n, VALIDATION.help);
  }

  get help() {
    return this._help;
  }

  setHelp(n) {
    this._help = validateOrThrow(n, VALIDATION.help);
    return this;
  }

  set aliases(n) {
    this._aliases = validateOrThrow(n, VALIDATION.aliases);
  }

  get aliases() {
    return this._aliases;
  }

  addAliases(n) {
    this._aliases = [...this.aliases, ...validateOrThrow(n, VALIDATION.aliases)];
    return this;
  }

  removeAliases(n) {
    this._aliases = this._aliases.filter(a => !n.includes(a));
    return this;
  }

  /**
   * @see Discord.Permissions.FLAGS
   */
  set permissions(n) {
    this._permissions = validateOrThrow(n, VALIDATION.permissions);
  }

  get permissions() {
    return this._permissions;
  }

  /**
   * @param {PermissionResolvable} n
   * @see Discord.Permissions.FLAGS
   */
  setPermissions(n) {
    this._permissions = validateOrThrow(n, VALIDATION.permissions);
    return this;
  }

  set cooldown(n) {
    this._cooldown = validateOrThrow(n, VALIDATION.cooldown);
  }

  get cooldown() {
    return this._cooldown;
  }

  setCooldown(n) {
    this._cooldown = validateOrThrow(n, VALIDATION.cooldown);
    return this;
  }

  set category(n) {
    this._category = validateOrThrow(n, VALIDATION.category);
  }

  get category() {
    return this._category;
  }

  setCategory(n) {
    this._category = validateOrThrow(n, VALIDATION.category);
    return this;
  }

  set runIn(n) {
    this._runIn = validateOrThrow(n, VALIDATION.runIn);
  }

  get runIn() {
    return this._runIn;
  }

  setRunIn(n) {
    this._runIn = validateOrThrow(n, VALIDATION.runIn);
    return this;
  }

  set hidden(n) {
    this._hidden = validateOrThrow(n, VALIDATION.hidden);
  }

  get hidden() {
    return this._hidden;
  }

  setHidden(n) {
    this._hidden = validateOrThrow(n, VALIDATION.hidden);
    return this;
  }

  set args(n) {
    this._args = validateOrThrow(n, VALIDATION.args);
  }

  get args() {
    return this._args;
  }

  setArgs(n) {
    this._args = validateOrThrow(n, VALIDATION.args);
    return this;
  }

  set delete(n) {
    this._delete = validateOrThrow(n, VALIDATION.delete);
  }

  get delete() {
    return this._delete;
  }

  setDelete(n) {
    this._delete = validateOrThrow(n, VALIDATION.delete);
    return this;
  }

  set run(n) {
    throw new Error('Setting command executor directly is not allowed.');
  }

  setRun(n) {
    this._run = validateOrThrow(n, VALIDATION.run);
    return this;
  }

  setExecutor(n) {
    this._run = validateOrThrow(n, VALIDATION.run);
    return this;
  }
}

module.exports = Command;
