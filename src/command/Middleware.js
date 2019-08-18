const last = arr => arr[arr.length - 1];
const reduceOneRight = arr => arr.slice(0, -1);

class Middleware {
  constructor() {
    this.middlewareCount = 0;
  }

  use(fn) {
    this.middlewareCount += 1;
    this.go = (stack => (...args) => stack(...reduceOneRight(args), () => {
      const _next = last(args);
      fn.apply(this, [
        ...reduceOneRight(args),
        _next.bind.apply(_next, [null, ...reduceOneRight(args)]),
      ]);
    }))(this.go);
  }

  go(...args) {
    const _next = last(args);
    _next.apply(this, reduceOneRight(args));
  }
}

module.exports = Middleware;
