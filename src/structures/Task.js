/**
 * A class that will be run be the Schedule
 * @abstract
 * @namespace
 * @see Schedule
 */
class Task {
  constructor(name, type, time) {
    const types = ['once', 'repeat'];
    if (!name) {
      throw new Error('Missing task name.');
    }
    if (!types.includes(type)) {
      throw new Error('Invalid task type. Use "once" or "repeat".');
    }
    if (!time) {
      throw new Error('You must set a task time.');
    }

    this.name = name;
    // Once or Repeat
    this.type = type;
    // Cron or Date
    this.time = time;
  }

  async run() {
    /* */
  }

  toString() {
    return `${this.name} (${this.type}) - ${this.time}`;
  }
}

module.exports = Task;
