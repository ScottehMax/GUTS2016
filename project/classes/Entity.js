/*
 Entities include players and mobs who can move
 as well as attack and die
 */
class Entity {
  constructor(name, y, x, h) {
    this.name = name;
    this.y = y;
    this.x = x;
    this.health = h;
    this.items = {'sword': 0, 'armour': 0};
  }

  move(dir) {
    // Probably better way of implementing, this will move entity's position
    switch (dir) {
      case 'n':
        this.y--;
        break;
      case 'e':
        this.x++;
        break;
      case 'w':
        this.x--;
        break;
      case 's':
        this.y++;
        break;
      default:
        break;
    }
  }

  take_damage(dam) {
    // dam is the damage from either a sword (e.g. sword.attack = dam = 5 or lava.damage = dam = 15)
    // whenever these objects perform an action that causes damage to the entity
    this.health -= dam;
  }

  equip_item(item) {
    // The player has equipped the selected item and can now use it
    this.items[item] = 1;
  }

  lose_item(item) {
    // The player has lost the item that they had
    this.items[item] = 0;
  }

}