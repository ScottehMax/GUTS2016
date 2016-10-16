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

exports.bearing = function(y1, y2, x1, x2) {
    return Math.atan2(x2, x1, y2, y1) / Math.PI * 360
}

exports.censor = function(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}

exports.simpleStringify = function(object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};