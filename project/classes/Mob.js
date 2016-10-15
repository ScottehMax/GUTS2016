"use strict";

var Entity = require('./Entity.js').Entity;
var utils = require('../utils.js');
/*
 Mobs are entities not controlled by users
 and are hostile towards players
 */

const VIEW_DIST = 5;
class Mob extends Entity {
  constructor(name, y, x, h, floor, start_sword, start_armour, level) {
    super(name, y, x, h, floor, start_sword, start_armour, level);
    this.hunting = false;
  }

  idle() {
    // Mob aimlessly wanders, searching for player
    var player;
    var directions = ['n', 'e', 'w', 's'];
    var dir = utils.randint(0, 3);
    dir = directions[dir];
    this.move(dir);
    // while this.hunting is false then idle
    // while(!this.hunting) {
      // search for players while idle
      // player = this.search();
    // }
    // this.hunt(player);
  }

  search(){
    for(var m_y = this.y + VIEW_DIST; m_y >= this.y - VIEW_DIST; m_y--)
      for(var m_x = this.x - VIEW_DIST; m_x <= this.x + VIEW_DIST; m_x++)
        if(this.floor.grid.occupied instanceof Player){this.hunting = true; return this.floor.grid.occupied;}
  }

  hunt(player) {
    // Mob hunts player down unless the player escapes its radius of sight
    while (this.y != player.y && this.x != player.x && this.hunting) {
      if (player.y < this.y) this.move('n');
      if (player.x > this.x) this.move('e');
      if (player.x < this.x) this.move('w');
      if (player.y > this.y) this.move('s');
      if (Math.abs(player.y - this.y) > 5 || Math.abs(player.x - this.x) > 5) this.hunting = false;
    }
    this.idle();
  }

  erase() {
    if (this.floor != null) {
      this.floor.grid[this.y][this.x].occupied = false;
      this.floor.npcs[this.uuid];
      console.log(this.uuid + ' has perished');
    }
  }

  die(){
    var i = this.items;
    // Drop any items the entity was carrying
    if(i['sword'] != null) console.log('DROPPED ' + i['sword'])// this.dungeon.grid[this.y][this.x].item(sword)
    // Erase entity
    this.erase()
  }
}

exports.Mob = Mob;