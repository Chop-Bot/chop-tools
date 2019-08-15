const findUp = require('find-up');
const merge = require('lodash.merge');

const { DEFAULT_CONFIG } = require('./util/constants');

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

class Configuration {
  static async getConfig(config = null) {
    if (isObject(config)) {
      return Configuration.mergeConfigs(DEFAULT_CONFIG, config);
    }
    if (await Configuration.hasChopJsConfig()) {
      return Configuration.mergeConfigs(DEFAULT_CONFIG, await Configuration.getChopJsConfig());
    }
    if (await Configuration.hasChopJsonConfig()) {
      return Configuration.mergeConfigs(DEFAULT_CONFIG, await Configuration.getChopJsonConfig());
    }
    if (await Configuration.hasPackageJsonConfig()) {
      return Configuration.mergeConfigs(DEFAULT_CONFIG, await Configuration.getPackageJsonConfig());
    }
    throw new Error('Could not find the configuration');
  }

  static async hasPackageJsonConfig() {
    const packagePath = await findUp('package.json');
    if (packagePath) {
      try {
        const pkg = module.require(packagePath);
        console.log(typeof pkg.chop, pkg.chop);
        return isObject(pkg.chop);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  static async getPackageJsonConfig() {
    const packagePath = await findUp('package.json');
    return module.require(packagePath).chop;
  }

  static async hasChopJsConfig() {
    const configPath = await findUp('chop.config.js');
    if (configPath) {
      try {
        console.log(configPath);
        const config = module.require(configPath);
        console.log(typeof config, config);
        return isObject(config);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  static async getChopJsConfig() {
    const configPath = await findUp('chop.config.js');
    return module.require(configPath);
  }

  static async hasChopJsonConfig() {
    const configPath = await findUp('chop.json');
    if (configPath) {
      try {
        const config = module.require(configPath);
        console.log(typeof config, config);
        return isObject(config);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  static async getChopJsonConfig() {
    const configPath = await findUp('chop.json');
    return module.require(configPath);
  }

  static async hasConfigs() {
    return {
      packageJson: await Configuration.hasPackageJsonConfig(),
      js: await Configuration.hasChopJsConfig(),
      json: await Configuration.hasChopJsonConfig(),
    };
  }

  static async getConfigFromPath(configPath) {
    if (configPath) {
      try {
        const config = module.require(configPath);
        if (!isObject(config)) throw new Error('Chop Config must be an object');
        return Configuration.mergeConfigs(DEFAULT_CONFIG, config);
      } catch (e) {
        throw new Error(`Could not load config at path ${configPath}`);
      }
    }
    throw new Error('You must provide a path to the config file');
  }

  static mergeConfigs(config1, config2) {
    return merge({}, config1, config2);
  }
}

module.exports = Configuration;
