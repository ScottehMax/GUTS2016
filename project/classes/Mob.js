import {Player} from "./Player";
"use strict";
/*
 Mobs are entities not controlled by users
 and are hostile towards players
 */

const VIEW_DIST = 5;
class Mob extends Entity {
  constructor(name, y, x, h, dungeon, start_sword, start_armour, level) {
    super(name, y, x, h, dungeon, start_sword, start_armour, level);
    this.hunting = false;
  }

  idle() {
    // Mob aimlessly wanders, searching for player
    var player;
    this.hunting = false;
    var directions = ['n', 'e', 'w', 's'];
    var dir = Math.random() * (directions.length);
    dir = directions[dir];
    this.move(dir);
    // while this.hunting is false then idle
    while(!this.hunting) {
      // search for players while idle
      player = this.search();
    }
    this.hunt(player);
  }

  search(){
    for(var m_y = this.y + VIEW_DIST; m_y >= this.y - VIEW_DIST; m_y--)
      for(var m_x = this.x - VIEW_DIST; m_x <= this.x + VIEW_DIST; m_x++)
        if(this.dungeon.grid.occupied instanceof Player){this.hunting = true; return this.dungeon.grid.occupied;}
  }

  hunt(player) {
    // Mob hunts player down unless the player escapes its radius of sight
    while (this.y != player.y && this.x != player.x && this.hunting) {
      if (player.y < this.y) this.move('n');
      if (player.x > this.x) this.move('e');
      if (player.x < this.x) this.move('w');
      if (player.y > this.y) this.move('s');
      if (Math.abs(player.y - this.y) > 5 || Math.abs(player.x - this.x) > 5) this.idle();
    }
  }
}