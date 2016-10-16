"use strict";
/*
 Entities include players and mobs who can move
 as well as attack and die
 */

var Weapon = require('./Weapon.js').Weapon;
var Mob = require('./Mob.js').Mob;
var utils = require('../utils.js');

const ATTACK_XP = 35;
const XP_LEVEL_UP_SCORE = 100;

class Entity {
  constructor(name, y, x, h, floor, start_weapon, start_armour, level, sprite) {
    this.name = name;
    this.y = y;
    this.x = x;
    this.bonus_health = 2 * level;
    this.health = h + this.bonus_health;
    this.maxhealth = h + this.bonus_health;
    this.floor = floor;
    this.items = {'weapon': start_weapon, 'armour': start_armour};
    this.level = level;
    this.direction = 'n';
    this.xp = 0;
    this.sprite = sprite;
  }

  move(dir) {
    if (!this.alive) return;
    // Probably better way of implementing, this will move entity's position
    // note: add try_move to floor
    var ent;

    switch (dir) {
      case 'n':
        this.direction = 'n';
        if(this.y > 0 && (ent = this.floor.grid[this.y-1][this.x].occupied) instanceof Entity){
          this.attack(ent);
        }
        if (this.floor.try_move(this, this.y-1, this.x)) {
          this.floor.grid[this.y][this.x].occupied = false;
          this.y--;
          this.floor.grid[this.y][this.x].occupied = this;
        }
        break;
      case 'e':
        this.direction = 'e';
        if(this.x < this.floor.width - 1 && (ent = this.floor.grid[this.y][this.x+1].occupied) instanceof Entity){
          this.attack(ent);
        }
        if (this.floor.try_move(this, this.y, this.x+1)) {
          this.floor.grid[this.y][this.x].occupied = false;
          this.x++;
          this.floor.grid[this.y][this.x].occupied = this;
        }
        break;
      case 'w':
        this.direction = 'w';
        if(this.x > 0 && (ent = this.floor.grid[this.y][this.x-1].occupied) instanceof Entity){
          this.attack(ent);
        }
        if (this.floor.try_move(this, this.y, this.x-1)) {
          this.floor.grid[this.y][this.x].occupied = false;
          this.x--;
          this.floor.grid[this.y][this.x].occupied = this;
        }
        break;
      case 's':
        this.direction = 's';
        if(this.y < this.floor.height - 1 && (ent = this.floor.grid[this.y+1][this.x].occupied) instanceof Entity){
          this.attack(ent);
        }
        if (this.floor.try_move(this, this.y+1, this.x)) {
          this.floor.grid[this.y][this.x].occupied = false;
          this.y++;
          this.floor.grid[this.y][this.x].occupied = this;
        }
        break;
      default:
        break;
    }

  }

  take_damage(ent, dam) {
    // dam is the damage from either a weapon (e.g. weapon.attack = dam = 5 or lava.damage = dam = 15)
    // whenever these objects perform an action that causes damage to the entity
    console.log('ent name ' +  ent.name);
    console.log('ent health ' + ent.health);
    console.log('this name ' + this.name);
    console.log('this dam ' + dam);
    console.log('this health ' + this.health);
    if (this.items['armour'] && dam > this.items['armour'].def) {
      dam = dam - this.items['armour'].def
      // this.health -= (dam - this.items['armour'].def);
    } else if (this.items['armour'] && this.items['armour'].def > dam) {
      dam = 1;
      // this.health -= 1;
    } else if (!this.items['armour']) {
      // this.health -= dam;
      dam = dam;
    }
    this.health -= dam
    if(this.health <= 0) this.die();
    return dam;
  }

  lose_item(item) {
    // The player has lost the item that they had
    this.items[item] = null;
  }

  attack(ent){
    // you're attacking ent
    // if (!this.alive) return;
    // Entity uses its weapon
    var weapon = this.items['weapon'];

    if(weapon == null){

      weapon = new Weapon('Fists', this.level * 2, 999); // Will need to adapt this to a better alternative
    }

    ent.take_damage(/* from */this, weapon.attack);
    weapon.degrade();

    if(weapon.durability <= 0) {
      this.lose_item('weapon');
    }

    if(ent.health <= 0) {
      this.xp += (20 * ent.level) * (ent.legendary == true ? 5 : 1);
    }
    if(this.xp >= (this.level * XP_LEVEL_UP_SCORE)) {
      this.xp = 0;
      this.level_up();
    }
  }

  consume(item){
    // User consumes item whatever it may be
    var i = this.items;

    if(item instanceof Weapon && i['weapon'] == null) {
      i['weapon'] = item;
    }

    console.log(i);

    if(item instanceof Armour && i['armour'] == null) {
      i['armour'] = item;
    }

    if(item instanceof Potion && this.health < this.maxhealth){
      if(this.health+item.points < this.maxhealth)
        this.health += item.points;
      else
        this.health = this.maxhealth;
    }
  }

  erase() {
    if (this.floor != null) {
      this.floor.grid[this.y][this.x].occupied = false;
      if (this instanceof Mob) delete this.floor.npcs[this.uuid];
      console.log(this.uuid + ' has perished');
    }
  }

  die(){
    this.alive = false;
    var i = this.items;
    // Drop any items the entity was carrying
    if(i['weapon'] != null) console.log('DROPPED ' + i['weapon'])// this.dungeon.grid[this.y][this.x].item(weapon)
    // Erase entity
    this.erase()
  }

  level_up(){
    // Player levels up which increased their health as well as resetting at the new maximum
    this.bonus_health = (++this.level) * 2;
    this.maxhealth = this.maxhealth + this.bonus_health;
  }

}

exports.Entity = Entity;