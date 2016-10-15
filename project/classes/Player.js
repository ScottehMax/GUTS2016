"use strict";
var Entity = require('./Entity.js').Entity;
/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, h, floor, start_sword, start_armour, level) {
    super(name, y, x, h, floor, start_sword,  start_armour, level);
  }

  erase() {
    if (this.floor != null) {
      this.floor.grid[this.y][this.x].occupied = false;
      delete this.floor.players[this.uuid];
      delete this.floor.dungeon.players[this.uuid];
    }
  }
}

exports.Player = Player;