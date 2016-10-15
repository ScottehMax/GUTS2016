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

  move(dir) {
    super.move(dir);
  }

  take_damage(dam) {
    super.take_damage(dam);
  }

  equip_item(item) {
    super.equip_item(item);
  }

  lose_item(item) {
    super.lose_item(item);
  }

  attack(){
    super.attack();
  }

  consume(item){
    super.consume(item);
  }

  erase() {
    this.dungeon.grid[this.y][this.x].occupied = false;
    delete this.dungeon.players[this.user.uuid];
  }
}

exports.Player = Player;