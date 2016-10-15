"use strict";
/*
 Armour is equipped by entities and provides them extra protection
 for a set time
 */
class Armour extends Item{
  constructor(name, dur){
    super(name);
    this.durability = dur;
  }
}