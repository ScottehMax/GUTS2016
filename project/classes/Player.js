/*
 Player is a controllable entity
 */
class Player extends Entity {
  constructor(name, y, x) {
    super(name, y, x, 100);
  }

  move(dir) {
    super.move(dir);
  }

  take_damage(dam) {
    super.take_damage(dam);
  }

  equip_item(item) {
    super.equip_item(item);
  }

  lose_item(item) {
    super.lose_item(item);
  }
}