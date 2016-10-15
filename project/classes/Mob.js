/*
 Mobs are entities not controlled by users
 and are hostile towards players
 */
class Mob extends Entity {
  constructor(name, y, x, h) {
    super(name, y, x, h);
  }

  move(dir) {
    super.move(dir);
  }

  take_damage(dam) {
    super.take_damage(dam);
  }

  lose_item(item) {
    super.lose_item(item);
  }

  attack(){
    super.attack();
  }

  consume(item){
    super.consume(item);
  }
}