/*
 Swords are weapons that cause damage equal to their attack stat
 onto other entities
 */
class Sword extends Item{
  constructor(name, a, dur){
    super(name);
    this.durability = dur;
    this.attack = a;
  }

  degrade(){
    super.degrade();
  }
}