"use strict";
var Entity = require('./Entity.js').Entity;
/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, dungeon, socket) {
    super(name, y, x, 100, dungeon);
    this.socket = socket;
  }

  erase() {
    this.dungeon.grid[this.y][this.x].occupied = false;
    delete this.dungeon.players[this.user.uuid];
  }
}

exports.Player = Player;