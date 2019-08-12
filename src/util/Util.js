class Util {
  static mapByName(items) {
    return new Map(items.map(item => [item.name, item]));
  }
}

module.exports = Util;
