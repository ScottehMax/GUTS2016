/*
 Hearts add a set number of health back to the entity that
 consumes it
 */
class Heart extends Item{
  constructor(){
    this.points = 20;
  }

  consumed(entity){
    // Increases health of entity that has consumed it unless
    // it returns false in which case it is not consumed at
    // all and remains where it was
    if(entity.health == 100) return false;
    else if(entity.health+=points >= 100) entity.health = 100;
    else entity.health+=points;
  }
}