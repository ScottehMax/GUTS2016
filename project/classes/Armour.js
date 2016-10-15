/*
 Armour is equipped by entities and provides them extra protection
 for a set time
 */
class Armour extends Item{
  constructor(name, dur){
    this.name = name;
    this.durability = dur;
  }

  consumed(entity){
    // Adds armour to entity that consumed it
    // unless entity already has armour equipped, so it returns false
    // and remains where it was
    if(entity.items['armour'] != null) return false;
    else entity.items['armour'] = this; // need to change entities to allow this first!!
  }

  degrade(){
    super.degrade();
  }
}