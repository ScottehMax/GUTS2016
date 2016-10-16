"use strict";

var Entity = require('./Entity.js').Entity;
var Player = require('./Player.js').Player;
var utils = require('../utils.js');
/*
 Mobs are entities not controlled by users
 and are hostile towards players
 */

const VIEW_DIST = 5;
class Mob extends Entity {
  constructor(name, y, x, h, floor, start_weapon, start_armour, level, sprite, ticks) {
    super(name, y, x, h, floor, start_weapon, start_armour, level, sprite);
    this.hunting = false;
    // how many ticks before it can move
    this.ticks = ticks;
    this.alive = true;
    // mutate this one tbh
    this.ticksleft = ticks;
  }

  consume() {
    return false;
  }

  random_move() {
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

  targeted_move(y, x) {
    var bearing = utils.bearing(this.floor.width - this.x, this.floor.height - this.y, this.floor.width - x, this.floor.height - y);
    // console.log(this.x);
    // console.log(this.y);
    // console.log(x);
    // console.log(y);
    // console.log(bearing);
    var dir;
    if ((bearing > 315 && bearing < 360) || bearing == 0 || (bearing > 0 && bearing <= 45)) {
      dir = 'w';
    } else if (bearing > 45 && bearing <= 135) {
      dir = 'n';
    } else if (bearing > 135 && bearing <= 225) {
      dir = 'e';
    } else if (bearing > 225 && bearing <= 315) {
      dir = 's';
    }
    // console.log(dir);
    this.move(dir);
  }

  search() {
    for(var m_y = (this.y - VIEW_DIST < 0 ? 0: this.y - VIEW_DIST); m_y < (this.y + VIEW_DIST > this.floor.height - 1 ? this.floor.height : this.y + VIEW_DIST); m_y++) {
      for(var m_x = (this.x - VIEW_DIST < 0 ? 0: this.x - VIEW_DIST); m_x < (this.x + VIEW_DIST > this.floor.width - 1 ? this.floor.width : this.x + VIEW_DIST); m_x++) {
        if (this.floor.grid[m_y][m_x].occupied instanceof Player) {
          // console.log('fuggggg');
          this.targeted_move(this.floor.grid[m_y][m_x].occupied.y, this.floor.grid[m_y][m_x].occupied.x);
          return;
          // this.hunting = true; return this.floor.grid.occupied;
        }
      }
    }
    this.random_move()
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
      delete this.floor.npcs[this.uuid];
      console.log(this.name + ' has perished');
    }
  }

  die(){
    var i = this.items;
    // Drop any items the entity was carrying
    if(i['weapon'] != null) {
      // pick a random location in the room
      var location = this.floor.random_location(this.floor.rooms[this.floor.grid[this.y][this.x].room_index]);
      var tries = 0;
      while (this.floor.grid[location[0]][location[1]].item != null) {
        var location = this.floor.random_location(this.floor.rooms[this.floor.grid[this.y][this.x].room_index]);
        tries++;
        if (tries > 20) {
          super.die();
          this.erase();
          return;
        }
      }
      var item = i['weapon'];
      item.y = location[0];
      item.x = location[1];


      if (!this.floor.grid[item.y][item.x].occupied) {
        this.floor.grid[item.y][item.x].occupied = item;
      }

      console.log('DROPPED ' + i['weapon'])// this.dungeon.grid[this.y][this.x].item(weapon)
    }
    // Erase entity
    super.die();
    this.erase();
  }
}

exports.Mob = Mob;