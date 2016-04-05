define(["exceptions"], function(E) {

    function test() {
        var total = 0;
        var failed = 0
        //Iterate through each testable prototype
        for (var i in test.testables) {
            console.log("--------------- Testing", test.testables[i].name, "---------------");
            for (var testKey in test.testables[i].tests) {
                var passed = true;
                try {
                    test.testables[i].tests[testKey]();
                } catch (e) {
                    test.fails[testKey] = e.stack;
                    passed = false;
                    failed++;
                }
                if (passed) {
                    console.log(testKey, "Passed");
                } else {
                    console.log("%c" + testKey + " Failed", "color: red;");
                }
                total++;
            }
        }

        if (failed == 0) {
            console.log("%cPassed All Tests", "color: green;");
        } else {
            console.log("Passed ", (total - failed), "out of", total);
        }

    }
    test.testables = [];
    test.fails = {};

    test.addTestables = function() {
        for (var i in arguments) {
            addTestable(arguments[i]);
        }
    }

    test.addTestable = function(functionClass) {
        if (typeof functionClass.prototype["assertState"] != "function") {
            throw new E.IllegalValueError(functionClass.name + " does not implement assertState.");
        }
        if (functionClass.tests == null) {
            throw new E.IllegalValueError(functionClass.name + " does not implement tests");
        }

        test.assertState(functionClass);
        test.testables.push(functionClass);
    }

    test.assert = function(bool) {
        if (!bool) {
            throw new E.AssertionException();
        }
    }

    /**
     * Replaces old methods of functionClass with new methods that call its 'assertState' method before
     * and after the method body.
     */
    test.assertState = function(functionClass) {
        if (typeof functionClass.prototype["assertState"] != "function") {
            throw new E.IllegalValueError("You must call assertState with an argument that has an assertState method in its prototype.");
        }

        //If we have already replaced the methods, return
        if (functionClass.STATE_ASSERTED) {
            return;
        }

        for (var key in functionClass.prototype) {
            if (typeof functionClass.prototype[key] == "function" && key != "assertState") {
                const originalFunctionName = "_" + key;
                functionClass.prototype[originalFunctionName] = functionClass.prototype[key];

                functionClass.prototype[key] = function() {
                    var returnValue;
                    this.assertState();
                    returnValue = this[originalFunctionName].apply(this, arguments);
                    this.assertState();
                    return returnValue;
                }
            }
        }

        functionClass.STATE_ASSERTED = true;
    }

    return test;
})
