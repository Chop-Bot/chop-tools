const Prompt = require('../structures/Prompt');

class VotePrompt extends Prompt {
  constructor(options) {
    super(options.filter);
  }

  async prompt() {
    // Do prompt
  }
}

module.exports = VotePrompt;
