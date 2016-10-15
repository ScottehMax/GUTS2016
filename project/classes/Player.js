"use strict";
var Entity = require('./Entity.js').Entity;
/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, h, dungeon, start_sword, start_armour, socket) {
    super(name, y, x, h, dungeon, start_sword,  start_armour);
    this.socket = socket;
  }

  erase() {
    this.dungeon.grid[this.y][this.x].occupied = false;
    delete this.dungeon.players[this.user.uuid];
  }
}

exports.Player = Player;