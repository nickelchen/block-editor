'use strict';

var LEVELS = {
    ERROR: 1,
    INFO: 2,
    DEBUG: 3,
    VERBOSE: 4
};

var level = LEVELS.DEBUG;

function error () {
    if (level >= LEVELS.ERROR) {
        console.log.apply(console, arguments);
    }
}

function info () {
    if (level >= LEVELS.INFO) {
        console.log.apply(console, arguments);
    }
}

function debug () {
    if (level >= LEVELS.DEBUG) {
        console.log.apply(console, arguments);
    }
}

function verbose () {
    if (level >= LEVELS.VERBOSE) {
        console.log.apply(console, arguments);
    }
}

module.exports = {
    error: error,
    info: info,
    debug: debug,
    verbose: verbose
};

