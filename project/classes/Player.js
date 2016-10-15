"use strict";
var Entity = require('./Entity.js').Entity;
var Sword = require('./Sword.js').Sword;
var Armour = require('./Armour.js').Armour;
var Potion = require('./Potion.js').Potion;
var message = require('../utils.js').sendMessage;

const ATTACK_XP = 35;
const XP_LEVEL_UP_SCORE = 5;

/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, h, floor, start_sword, start_armour, level) {
    super(name, y, x, h, floor, start_sword,  start_armour, level);
  }
  
  take_damage(ent, dam) {
    message(this, ent.name + ' attacked you for ' + dam + ' damage', 1);
    super.take_damage(ent, dam);
  }
  
  attack(ent) {
    // Entity uses its weapon
    var weapon = this.items['sword'];
    if(weapon == null){
      weapon = new Sword('Fists', 10, 999); // Will need to adapt this to a better alternative
    }

    ent.take_damage(this, weapon.attack);
    weapon.degrade();

    message(this, 'You attacked ' + ent.name + ' for ' + weapon.attack + ' damage', 1);

    if(weapon.durability <= 0) {
      message(this, 'Your ' + weapon.name + ' has broken.', 1);
      this.lose_item('sword');
    }

    if(ent.health <= 0) {
      message(this, 'You killed ' + ent.name, 1);

      this.xp += ATTACK_XP;
    }
    if(this.xp >= (this.level * XP_LEVEL_UP_SCORE)) this.level_up();
  }

  consume(item){
    // User consumes item whatever it may be
    var i = this.items;

    if(item instanceof Sword && i['sword'] == null) {
      i['sword'] = item;
      message(this, 'You acquired the ' + item.name, 1);
    }

    if(item instanceof Armour && i['armour'] == null) {
      i['armour'] = item;
      message(this, 'You acquired the ' + item.name, 1);
    }

    if(item instanceof Potion && this.health < this.maxhealth){
      message(this, 'Acquired a potion, +' + item.points + ' health', 1);
      if(this.health+item.points < this.maxhealth)
        this.health += item.points;
      else
        this.health = this.maxhealth;
    }
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
    message(this, 'You died.', 2);
    super.die();
    this.erase();
  }

  level_up(){
    message(this, 'You levelled up, now on level' + this.level, 2);
    super.level_up();
  }
}

exports.Player = Player;