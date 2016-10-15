/*
 Mobs are entities not controlled by users
 and are hostile towards players
 */
class Mob extends Entity {
  constructor(name, y, x, h, start_sword, start_armour) {
    super(name, y, x, h, start_sword, start_armour);
  }
}