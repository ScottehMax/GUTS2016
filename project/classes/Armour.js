"use strict";
/*
 Armour is equipped by entities and provides them extra protection
 for a set time
 */

var Item = require('./Item.js').Item;

class Armour extends Item{
  constructor(name, def, dur){
    super(name);
    this.durability = dur;
    this.def = def;
  }
}

exports.Armour = Armour;