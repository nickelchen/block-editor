'use strict';

var Promise = require('es6-promise').Promise;
var Logger = require('./Logger');
var Utils = require('./Utils');

var autoIncrQueueId = 1;
var queues = {};

var QueueItem = function (request, params) {
    this.request = request;
    this.params = params;
};

QueueItem.prototype.send = function () {
    var request = this.request;
    var params = this.params;

    Logger.verbose('RequestQueue in QueueItem send, request:', Utils.getFunName(request), ', params:', params);

    return request.apply(null, params);
};

var Queue = function (queueId) {
    this.id = queueId;
    this.items = [];
};

Queue.prototype.sendItem = function () {
    // 负责将item按顺序发出去。并不处理异常。
    // 你需要在你的 *最后一个* promise中，自己处理异常
    var self = this;

    var item = self.items.shift();
    if (self.length() >= 1) {
        return item.send().then(function () {
            return self.sendItem();
        });
    } else {
        return item.send();
    }
};

Queue.prototype.length = function () {
    return this.items.length;
};

Queue.prototype.start = function () {
    if (this.length() === 0) {
        throw Error('RequestQueue can not start empty queue');
    } else {
        return this.sendItem();
    }
};

Queue.prototype.enqueue = function () {
    var request = arguments[0];
    var params = Array.prototype.slice.call(arguments, 1) || [];
    var item = new QueueItem(request, params);
    this.items.push(item);
};

function startQueue (queueId, finishCallback, errorCallback) {
    var queue = queues[queueId];
    queue.start(finishCallback, errorCallback);
}

function createQueue () {
    var queue = new Queue(++autoIncrQueueId);
    return queue;
}

module.exports = {
    createQueue: createQueue,
    startQueue: startQueue
};


