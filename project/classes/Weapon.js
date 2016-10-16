"use strict";
/*
 Weapon are weapons that cause damage equal to their attack stat
 onto other entities
 */
var Item = require('./Item.js').Item;

class Weapon extends Item{
  constructor(name, a, dur){
    super(name);
    this.durability = dur;
    this.attack = a;
  }
}

exports.Weapon = Weapon;