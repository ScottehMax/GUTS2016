"use strict";
/*
 Hearts add a set number of health back to the entity that
 consumes it
 */
class Heart extends Item{
  constructor(p){
    super('');
    this.points = p;
  }
}