const findUp = require('find-up').sync;
const merge = require('lodash.merge');

const { DEFAULT_CONFIG } = require('./util/constants');

/**
 * @typedef {Object} ConfigPresence
 * @property {Boolean} packageJson Wether a package.json config was found.
 * @property {Boolean} js Wether a valid chop.config.js file was found.
 * @property {Boolean} json Wether a valid chop.json file was found.
 */

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

/**
 * Loads configuration.
 * @since v0.0.1
 */
class Configuration {
  /**
   * Gets the defined configuration and merges it with the default ones.
   * Priority: The config param -> chop.config.js -> chop.json -> chop property in package.json
   * @static
   * @param {Object} [config=null] User provided configuration in {@link ChopClient ChopClient} constructor.
   * @returns {ClientOptions} The configuration.
   * @memberof Configuration
   */
  static getConfig(config = null) {
    let merged = merge({}, DEFAULT_CONFIG);
    if (isObject(config)) {
      merged = merge(merged, config);
    }
    if (this.hasChopJsConfig()) {
      return merge(merged, this.getChopJsConfig());
    }
    if (this.hasChopJsonConfig()) {
      return merge(merged, this.getChopJsonConfig());
    }
    if (this.hasPackageJsonConfig()) {
      return merge(merged, this.getPackageJsonConfig());
    }
    return merged;
  }

  /**
   * Looks for a chop property in the nearest package.json
   * @static
   * @returns {Boolean}
   * @memberof Configuration
   */
  static hasPackageJsonConfig() {
    const packagePath = findUp('package.json');
    if (packagePath) {
      try {
        const pkg = module.require(packagePath);
        return isObject(pkg.chop);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Gets the value of the chop property in the nearest package.json
   * @static
   * @returns {Object}
   * @memberof Configuration
   */
  static getPackageJsonConfig() {
    const packagePath = findUp('package.json');
    return module.require(packagePath).chop;
  }

  /**
   * Looks for a nearby chop.config.js file.
   * @static
   * @returns {Boolean}
   * @memberof Configuration
   */
  static hasChopJsConfig() {
    const configPath = findUp('chop.config.js');
    if (configPath) {
      try {
        const config = module.require(configPath);
        return isObject(config);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Gets the module.exports value of the nearest chop.config.js file.
   * @static
   * @returns {Object}
   * @memberof Configuration
   */
  static getChopJsConfig() {
    const configPath = findUp('chop.config.js');
    return module.require(configPath);
  }

  /**
   * Looks for a nearby chop.json file.
   * @static
   * @returns {Boolean}
   * @memberof Configuration
   */
  static hasChopJsonConfig() {
    const configPath = findUp('chop.config.json');
    if (configPath) {
      try {
        const config = module.require(configPath);
        return isObject(config);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Gets the value from the nearest chop.json file.
   * @static
   * @returns {Object}
   * @memberof Configuration
   */
  static getChopJsonConfig() {
    const configPath = findUp('chop.config.json');
    return module.require(configPath);
  }

  /**
   * Checks for configuration files.
   * @static
   * @returns {ConfigPresence}
   * @memberof Configuration
   */
  static hasConfigs() {
    return {
      packageJson: Configuration.hasPackageJsonConfig(),
      js: Configuration.hasChopJsConfig(),
      json: Configuration.hasChopJsonConfig(),
    };
  }
}

module.exports = Configuration;
