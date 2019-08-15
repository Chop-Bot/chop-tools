/**
 * Base class for prompts
 * @abstract
 * @namespace
 */
class Prompt {
  /**
   *Creates an instance of Prompt.
   * @param {PromptFilter} filter The filter this prompt will use
   */
  constructor(filter) {
    this.filter = filter;
  }
}

module.exports = Prompt;
