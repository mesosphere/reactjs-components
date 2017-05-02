// jsdom doesn't have support for requestAnimationFrame so we polyfill it.
// https://gist.github.com/paulirish/1579671
(function() {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];

  for (var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
    global.requestAnimationFrame = global[vendors[x] + "RequestAnimationFrame"];
    global.cancelAnimationFrame =
      global[vendors[x] + "CancelAnimationFrame"] ||
      global[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!global.requestAnimationFrame)
    global.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = global.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };

  if (!global.cancelAnimationFrame) {
    global.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
