"use strict";
/*
 Items are consumables by entities
 */
class Item{
  constructor(n){this.name = n;}
  degrade(){this.durability--;}
}

exports.Item = Item;