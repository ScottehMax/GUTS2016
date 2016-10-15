"use strict";
/*
 Potion add a set number of health back to the entity that
 consumes it
 */
var Item = require('./Item.js').Item;

class Potion extends Item{
  constructor(p){
    super('');
    this.points = p;
  }
}