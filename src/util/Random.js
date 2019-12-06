module.exports = class Text {
  constructor() {
    throw new Error("Bruh... you can't instantiate Random.");
  }

  static number(min, max, howMany) {
    return 1;
  }

  static pick(arr, howMany) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};
