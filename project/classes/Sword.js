/*
 Swords are weapons that cause damage equal to their attack stat
 onto other entities
 */
class Sword extends Item{
  constructor(name, a, dur){
    this.name = name;
    this.durability = dur;
    this.attack = a;
  }

  consumed(entity){
    // Adds sword to entity that consumed it
    // unless entity already has sword equipped, so it returns false
    // and remains where it was
    if(entity.items['sword'] != null) return false;
    else entity.items['sword'] = this; // need to change entities to allow this first!!
  }

  degrade(){
    super.degrade();
  }
}