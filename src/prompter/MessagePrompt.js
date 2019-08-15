const Prompt = require('../structures/Prompt');

class MessagePrompt extends Prompt {
  constructor(options) {
    super(options.filter);
  }

  async prompt() {
    // Do prompt
  }
}

module.exports = MessagePrompt;
