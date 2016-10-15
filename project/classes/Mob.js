/*
 Mobs are entities not controlled by users
 and are hostile towards players
 */
class Mob extends Entity {
  constructor(name, y, x, h, start_sword, start_armour, level) {
    super(name, y, x, h, start_sword, start_armour, level);
    this.hunting = false;
  }

  idle() {
    // Mob aimlessly wanders, searching for player
    this.hunting = false;
    var directions = ['n', 'e', 'w', 's'];
    var dir = Math.random() * (directions.length - 0);
    dir = directions[dir];
    this.move(dir);
    // while this.hunting is false then idle
    // search for players while idle
    // when player is found go into hunt mode, this.hunting = true
    this.hunting = true; // delete line when idle has been implemented fully, this just prevents infinite loop
  }

  hunt(player) {
    // Mob hunts player down unless the player escapes its radius of sight
    while (this.y != player.y && this.x != player.x && this.hunting) {
      if (player.y < this.y) this.move('n');
      if (player.x > this.x) this.move('e');
      if (player.x < this.x) this.move('w');
      if (player.y > this.y) this.move('s');
      if (Math.abs(player.y - this.y) > 5 || Math.abs(player.x - this.x) > 5) this.idle();
    }
  }
}