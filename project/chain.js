"use strict";

var fs = require('fs');
var Foswig = require('foswig');

var chain = new Foswig(3);

function capword(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function capitalise(s) {
    if (s.split(' ').length > 1) {
        return s.split(' ').map(capword).join(' ');
    }
    return capword(s);
}

var fs = require('fs');

var contents = fs.readFileSync('./project/census-dist-male-first.txt').toString()
var names = contents.split('\n');
for (var name = 0; name < names.length - 1; name++) {
  var info = names[name].match(/\S+/g);;
  chain.addWordToChain(info[0]);
}
// fs.readFile('./project/census-dist-male-first.txt', 'utf8', function(err, data) {
//   if (err) throw err;
//   var names = data.split('\n');
//   for (var name = 0; name < names.length - 1; name++) {
//     var info = names[name].match(/\S+/g);;
//     chain.addWordToChain(info[0]);
//   }
// });

// fs.readFile('./project/census-dist-female-first.txt', 'utf8', function(err, data) {
//   if (err) throw err;
//   var names = data.split('\n');
//   for (var name = 0; name < names.length - 1; name++) {
//     var info = names[name].match(/\S+/g);;
//     chain.addWordToChain(info[0]);
//   }
// });
var contents = fs.readFileSync('./project/census-dist-female-first.txt').toString()
var names = contents.split('\n');
for (var name = 0; name < names.length - 1; name++) {
  var info = names[name].match(/\S+/g);;
  chain.addWordToChain(info[0]);
}

var weapon_chain = new Foswig(2);
// fs.readFile('./project/weapons.txt', 'utf8', function(err, data) {
//   if (err) throw err;
//   var names = data.split('\n');
//   for (var name = 0; name < names.length - 1; name++) {
//     weapon_chain.addWordToChain(names[name].toUpperCase());
//   }
// });
var contents = fs.readFileSync('./project/weapons.txt').toString()
var names = contents.split('\n');
for (var name = 0; name < names.length - 1; name++) {
  weapon_chain.addWordToChain(names[name].toUpperCase());
}



exports.name_chain = chain;
exports.weapon_chain = weapon_chain;
exports.gen_name = function() {
    return capitalise(chain.generateWord(5, 10, false));
};
exports.gen_weapon = function() {
    return capitalise(weapon_chain.generateWord(5, 10, false, 100));
};