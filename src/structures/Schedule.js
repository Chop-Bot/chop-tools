const nodeSchedule = require('node-schedule');
const moment = require('moment');

const TaskStore = require('../stores/TaskStore');

/**
 * Loads the tasks it receives and schedule them to be run.
 * @namespace
 */
class Schedule {
  /**
   * Manages tasks
   * @param {ChopClient} client The client that instantied this schedule
   * @param {Collection<String, Task>} tasks The tasks to schedule mapped by their name
   */
  constructor(client, tasks) {
    if (!client) {
      throw new Error('Missing client in Schedule constructor.');
    }
    if (!tasks) {
      throw new Error('Missing tasks in Schedule constructor.');
    }
    this.client = client;
    this.tasks = new TaskStore(client, tasks);
    this.tasks.forEach(t => this.create(t));
  }

  create(newTask) {
    const task = newTask;
    Object.defineProperty(task, 'client', { value: this.client });
    if (!task.name) {
      this.client.events.emit('warn', `[Schedule] Task ${task} does not have a name. Ignoring it.`);
      return;
    }
    let ocurrence;
    if (task.type === 'once') {
      if (!moment(task.time).isAfter(moment())) {
        this.client.events.emit(
          'warn',
          '[Schedule] Time for task',
          task.name,
          'already passed. Will not schedule.',
        );
        return;
      }
      ocurrence = moment(task.time).toDate();
    }
    if (task.type === 'repeat') {
      ocurrence = task.time;
    }
    task.job = nodeSchedule.scheduleJob(ocurrence, () => task.run());
    this.tasks.set(task.name, task);
  }
}

module.exports = Schedule;
