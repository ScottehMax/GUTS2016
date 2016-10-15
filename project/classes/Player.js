"use strict";
var Entity = require('./Entity.js').Entity;
/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, h, dungeon, start_sword, start_armour, level) {
    super(name, y, x, h, dungeon, start_sword,  start_armour, level);
  }

  erase() {
    if (this.dungeon != null) {
      this.dungeon.grid[this.y][this.x].occupied = false;
      delete this.dungeon.players[this.uuid];
      console.log(this.uuid + ' has perished');
    }
  }
}

exports.Player = Player;