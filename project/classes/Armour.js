"use strict";
/*
 Armour is equipped by entities and provides them extra protection
 for a set time
 */

var Item = require('./Item.js').Item;

class Armour extends Item{
  constructor(name, dur){
    super(name);
    this.durability = dur;
  }
}