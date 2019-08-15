const Prompt = require('../structures/Prompt');

class ChoicePrompt extends Prompt {
  constructor(options) {
    super(options.filter);
  }

  async prompt() {
    // Do prompt
  }
}

module.exports = ChoicePrompt;
