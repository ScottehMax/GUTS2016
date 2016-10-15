/*
 Items are consumables by entities
 */
class Item{
  constructor(){}
  consumed(entity){}
  degrade(){this.durability--;}
}