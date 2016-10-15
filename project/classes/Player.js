"use strict";
var Entity = require('./Entity.js').Entity;
var Global = require('../global.js');
/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, h, floor, start_sword, start_armour, level) {
    super(name, y, x, h, floor, start_sword,  start_armour, level);
    this.alive = true;
  }

  erase() {
    if (this.floor != null) {
      this.floor.grid[this.y][this.x].occupied = false;
      delete this.floor.players[this.uuid];
      delete this.floor.dungeon.players[this.uuid];
      console.log(this.uuid + ' has perished');
    }
  }

  die() {
    super.die();
    this.erase();
    this.alive = false;
    Global.users[this.uuid].socket.sendUTF(JSON.stringify({"type": "death"}));
  }
}

exports.Player = Player;