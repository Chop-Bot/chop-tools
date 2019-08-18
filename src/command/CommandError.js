/**
 * This represents a error that happened inside a command.
 * @since v0.0.1
 */
class CommandError extends Error {
  /**
   * Creates an instance of CommandError.
   * @param {Command} command The command that was called.
   * @param {CommandCall} call The command call information.
   * @param {Error} error The error that was thrown.
   * @memberof CommandError
   */
  constructor(command, call, error) {
    super(`An error happened while running the command ${command.name}.`);

    /**
     * @type {CommandCall}
     */
    this.call = call;
    /**
     * @type {Error}
     */
    this.error = error;
  }
}

module.exports = CommandError;
