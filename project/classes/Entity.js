"use strict";
/*
 Entities include players and mobs who can move
 as well as attack and die
 */
class Entity {
  constructor(name, y, x, h, dungeon) {
    this.name = name;
    this.y = y;
    this.x = x;
    this.health = h;
    this.dungeon = dungeon;
    this.items = {'sword': null, 'armour': null};
  }

  move(dir) {
    // Probably better way of implementing, this will move entity's position
    // note: add try_move to dungeon

    
    switch (dir) {
      case 'n':
        if (this.dungeon.try_move(this, this.y-1, this.x)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.y--;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      case 'e':
        if (this.dungeon.try_move(this, this.y, this.x+1)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.x++;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      case 'w':
        if (this.dungeon.try_move(this, this.y, this.x-1)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.x--;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      case 's':
        if (this.dungeon.try_move(this, this.y+1, this.x)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.y++;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      default:
        break;
    }
    
  }

  take_damage(dam) {
    // dam is the damage from either a sword (e.g. sword.attack = dam = 5 or lava.damage = dam = 15)
    // whenever these objects perform an action that causes damage to the entity
    this.health -= dam;
  }

  lose_item(item) {
    // The player has lost the item that they had
    this.items[item] = null;
  }

  attack(){
    var weapon = this.items['sword'];
    if(weapon == null) return false;
    //var damage = weapon.attack;
    // Complete later
    weapon.degrade();
    if(weapon.durability <= 0) this.lose_item('sword');
  }

  consume(item){
    var i = this.items;
    if(item instanceof Sword && i['sword'] == null) i['sword'] = item;
    if(item instanceof Armour && i['armour'] == null) i['armour'] = item;
    if(item instanceof Heart && this.health < 100){
      if(this.health+item.points < 100)
        this.health+=item.points;
      else
        this.health = 100;
    }
  }

  erase() {
    null;
  }

}

exports.Entity = Entity;