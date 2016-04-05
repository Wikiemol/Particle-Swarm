define(["exceptions"], function(E) {

    /**
     * Throws an IllegalValueError if the given keys do not 
     * have corresponding values in the given object
     */
    function keyValuesDefined() {
        var obj = arguments[arguments.length - 1];
        var keys = Array.prototype.slice.call(arguments).slice(0, arguments.length - 1);
        for (var index in keys) {
          var key = keys[index];
          if (obj[key] == null) {
              throw new E.IllegalValueError("Object " + obj + " can't be undefined at " + key + ".");
          }
        }
    }

    return {
        keyValuesDefined: keyValuesDefined
    }
});
