const Client = require('./ChopClient');
const Prompter = require('./prompter/Prompter');
const Command = require('./structures/Command');
const Task = require('./structures/Task');
const Listener = require('./listener/Listener');
const Util = require('./util/Util');
const Text = require('./util/Text');

module.exports = {
  Client,
  Prompter,
  Command,
  Task,
  Listener,
  stringMatch: Util.listen,
  COMMON_EXPRESSIONS: Util.COMMON_EXPRESSIONS,
  Text,
};
