'use strict';

var timeouts = {};
var DEFAULT_TIMEOUT = 2000;

var startTimer = function (objId) {
    clearTimer(objId);

    var invokeAgain = function () {
        timeouts[objId] = setTimeout(function() {
            startTimer(objId);
        }, DEFAULT_TIMEOUT);
    };

    // you can get obj then do something on it.
    //
    // var obj = SomeStore.getObj(objId);
    // SomeApi.doSomething(obj).then(invokeAgain).catch(invokeAgain);
};

var clearTimer = function (objId) {
    var id = timeouts[objId];
    window.clearTimeout(id);
};

module.exports = {
    startTimer: startTimer,
    clearTimer: clearTimer
};
