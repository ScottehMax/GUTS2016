"use strict";
/*
 Entities include players and mobs who can move
 as well as attack and die
 */
class Entity {
  constructor(name, y, x, h, dungeon, start_sword, start_armour, level) {
    this.name = name;
    this.y = y;
    this.x = x;
    this.bonus_health = 2 * level;
    this.health = h + this.bonus_health;
    this.dungeon = dungeon;
    this.items = {'sword': start_sword, 'armour': start_armour};
    this.level = level;
    this.direction = 'n';
    this.xp = 0;
  }

  move(dir) {
    // Probably better way of implementing, this will move entity's position
    // note: add try_move to dungeon

    
    switch (dir) {
      case 'n':
        this.direction = 'n';
        if (this.dungeon.try_move(this, this.y-1, this.x)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.y--;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      case 'e':
        this.direction = 'e';
        if (this.dungeon.try_move(this, this.y, this.x+1)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.x++;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      case 'w':
        this.direction = 'w';
        if (this.dungeon.try_move(this, this.y, this.x-1)) {
          this.dungeon.grid[this.y][this.x].occupied = false;
          this.x--;
          this.dungeon.grid[this.y][this.x].occupied = this;
        }
        break;
      case 's':
        this.direction = 's';
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
    if(this.health <= 0) this.die();
  }

  lose_item(item) {
    // The player has lost the item that they had
    this.items[item] = null;
  }

  attack(){
    // Entity uses its weapon
    var weapon = this.items['sword'];
    if(weapon == null) return false;
    weapon.degrade();
    if(weapon.durability <= 0) this.lose_item('sword');
    if(this.xp >= (this.level * 30)) this.level_up();
  }

  consume(item){
    // User consumes item whatever it may be
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

  die(){
    var i = this.items;
    // Drop any items the entity was carrying
      // if(i['sword'] != null && i['armour'] == null) drop sword in current tile
      // else if(i['sword'] == null && i['armour'] != null) drop armour in current tile
      // else drop sword and armour in adjacent tiles
    // Erase entity
    this.erase();
  }

  level_up(){
    // Player levels up which increased their health as well as resetting at the new maximum
    this.bonus_health = (++this.level) * 2;
    this.health = 100 + this.bonus_health;
  }

}

exports.Entity = Entity;