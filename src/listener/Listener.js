const Util = require('../util/Util');

/**
 * A listener will watch messages and trigger a piece of code when it detects a
 * message that matches the words it was configured with.
 *
 * @class Listener
 * @property {string[]} words Words to watch for. (regex syntax)
 * @property {string} [category] The category this listener belongs to.
 * @property {number} cooldown Listener will not trigger for a user based on this cooldown.
 * @property {number} [globalCooldown] Cooldown that applies to all users.
 * @property {number} [priority] Lower priority means the listener runs earlier.
 * @property {function} run The method that will be run when the listener is triggered.
 * @since v0.0.2
 */
class Listener {
  constructor({ words, cooldown, category, globalCooldown, priority, run }) {
    if (!words || (!cooldown && cooldown !== 0) || !run) {
      throw new Error('A listener requires words, cooldown and a run function.');
    }
    this.words = words;
    this.category = category;
    this.cooldown = cooldown;
    this.cooldowns = new Map();
    this.globalCooldown = globalCooldown || null;
    this.priority = Number(priority) || 0;
    this.run = run;
  }

  evaluate = message => {
    const { author } = message;
    if (author.bot) return false;
    // Global cooldown for this listener.
    if (this.globalCooldown && Date.now() - this.cooldowns.get('GLOBAL') < 0) return false;
    // if no records for this user or if off cooldown
    if (!this.cooldowns.get(author.id) || Date.now() - this.cooldowns.get(author.id) > 0) {
      // do stuff
      if (Util.listen(message, this.words)) {
        const result = this.run(message);
        // set cooldown
        this.cooldowns.set(author.id, Date.now() + this.cooldown * 1000);
        if (this.globalCooldown) {
          this.cooldowns.set('GLOBAL', Date.now() + this.globalCooldown * 1000);
        }
        return result;
      }
    }
    return false;
  };

  toString() {
    if (!Array.isArray(this.words)) return this.words;
    return `Listener [${this.words.join(' ')} / ${this.category}]`;
  }
}

Listener[Symbol.toStringTag] = 'Listener';

module.exports = Listener;
