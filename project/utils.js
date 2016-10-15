"use strict";

exports.uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

exports.randint = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.distance = function(y1, x1, y2, x2) {
    return Math.sqrt(Math.pow(Math.abs(y1 - y2), 2) + Math.pow(Math.abs(x1 - x2), 2));
}