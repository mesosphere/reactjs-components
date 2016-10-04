// jsdom doesn't have support for requestAnimationFrame so we just make it work.
global.requestAnimationFrame = function (func) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  return func.apply(this, args);
};
