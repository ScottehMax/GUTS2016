"use strict";
/*
 Swords are weapons that cause damage equal to their attack stat
 onto other entities
 */
var Item = require('./Item.js').Item;

class Sword extends Item{
  constructor(name, a, dur){
    super(name);
    this.durability = dur;
    this.attack = a;
  }
}

exports.Sword = Sword;