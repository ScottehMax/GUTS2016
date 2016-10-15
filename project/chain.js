"use strict";

var Foswig = require('foswig');

var chain = new Foswig(3);
function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
var fs = require('fs');

fs.readFile('census-dist-male-first.txt', 'utf8', function(err, data) {
  if (err) throw err;
  names = data.split('\n');
  for (var name = 0; name < names.length - 1; name++) {
    info = names[name].match(/\S+/g);;
    chain.addWordToChain(info[0]);
  }
});

fs.readFile('census-dist-female-first.txt', 'utf8', function(err, data) {
  if (err) throw err;
  names = data.split('\n');
  for (var name = 0; name < names.length - 1; name++) {
    info = names[name].match(/\S+/g);;
    chain.addWordToChain(info[0]);
  }
});

exports.name_chain = chain;

