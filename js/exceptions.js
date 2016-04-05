define(function() {

    var renameFunction = function (name, fn) {
        return (new Function("return function (call) { return function " + name +
            " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
    };   

    function createException(exceptionName) {
        const name = exceptionName;
        var exception = renameFunction(name, function(message) {
            this.name = name;
            this.message = message;
            this.stack = (new Error()).stack;
        });
        exception.prototype = Object.create(Error.prototype);
        exception.prototype.constructor = exception;
        return exception;
    }

    var E = { exception:createException("AssertionException2")};
    //console.log(E.exception instanceof Error);

    var exceptions = {
        IllegalValueError: (createException("IllegalValueError")),
        IllegalStateException: createException("IllegalStateException"),
        IllegalArgumentException: createException("IllegalArgumentException"),
        IndexOutOfBoundsException: createException("IndexOutOfBoundsException"),
        AssertionException: createException("AssertionException")
    }

    return exceptions;
})