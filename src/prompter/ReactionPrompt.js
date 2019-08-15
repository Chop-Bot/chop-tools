const Prompt = require('../structures/Prompt');

class ReactionPrompt extends Prompt {
  constructor(options) {
    super(options.filter);
  }

  async prompt() {
    // Do prompt
  }
}

module.exports = ReactionPrompt;
