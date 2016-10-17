"use strict";
var Entity = require('./Entity.js').Entity;
var Weapon = require('./Weapon.js').Weapon;
var Armour = require('./Armour.js').Armour;
var Potion = require('./Potion.js').Potion;
var message = require('../utils.js').sendMessage;

const ATTACK_XP = 35;
const XP_LEVEL_UP_SCORE = 100;

var Global = require('../global.js');
/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x, h, floor, start_weapon, start_armour, level, sprite) {
    super(name, y, x, h, floor, start_weapon,  start_armour, level, sprite);
    this.visibleMapStr = "";
  }
  
  take_damage(ent, dam) {
    var dmg = super.take_damage(ent, dam);
    console.log('player ' + dam)
    message(this, ent.name + ' attacked you for ' + dmg + ' damage', 1);
    // super.take_damage(ent, dam);
  }
  
  attack(ent) {
    // Entity uses its weapon
    var weapon = this.items['weapon'];
    if(weapon == null){
      weapon = new Weapon('Fists', 5, 999); // Will need to adapt this to a better alternative
    }

    var dmg = ent.take_damage(this, weapon.attack);
    weapon.degrade();

    message(this, 'You attacked ' + ent.name + ' for ' + dmg + ' damage', 1);

    if(weapon.durability <= 0) {
      message(this, 'Your ' + weapon.name + ' has broken.', 1);
      this.lose_item('weapon');
    }

    if(ent.health <= 0) {
      message(this, 'You killed ' + ent.name, 1);

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

    if((item instanceof Weapon && i['weapon'] == null) || (item instanceof Weapon && i['weapon'].attack < item.attack)) {
      i['weapon'] = item;
      message(this, 'You acquired the ' + item.name, 1);
    } else if (item instanceof Weapon && i['weapon'].attack >= item.attack) {
      message(this, 'You acquired the ' + item.name + ', but your current weapon is stronger', 1);
    }

    if((item instanceof Armour && i['armour'] == null) || (item instanceof Armour && i['armour'].def < item.def)) {
      i['armour'] = item;
      message(this, 'You acquired the ' + item.name, 1);
    } else if (item instanceof Armour && i['armour'].def > item.def) {
      message(this, 'You acquired the ' + item.name + ', but your current armour is stronger', 1);
    }

    if(item instanceof Potion && this.health < this.maxhealth){
      message(this, 'Acquired a potion, +' + item.points + ' health', 1);
      if(this.health+item.points <= this.maxhealth)
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
    Global.users[this.uuid].socket.sendUTF(JSON.stringify({"type": "death"}));
  }

  level_up(){
    super.level_up();
    message(this, 'You levelled up to level ' + this.level, 2);
  }
}

exports.Player = Player;