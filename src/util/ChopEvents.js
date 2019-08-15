const { EventEmitter } = require('events');

/**
 * The EventEmitter class is defined and exposed by the events module.
 * @external EventEmitter
 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter|EventEmitter}
 */

/**
 * Handles events for Chop Tools.
 * @class ChopEvents
 * @extends {external:EventEmitter}
 */
class ChopEvents extends EventEmitter {}

module.exports = ChopEvents;
