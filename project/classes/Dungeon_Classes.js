"use strict";
/*
Some conventions:
Height and width are lengths.
x, y, etc, are generally locations on the grid.
y before x. height before width.
*/



var utils = require('../utils.js');
var Global = require('../global.js');
var Mob = require('./Mob.js').Mob;
var Player = require('./Player.js').Player;
var randint = utils.randint;
var distance = utils.distance;

const MAX_TUNNELS = 2;
const MAX_FLOORS = 15;
const DRAW_DISTANCE = 5;

class Dungeon {
  constructor(height, width, max_h, max_w) {
    this.floors = {};
    this.players = {};
    this.height = height;
    this.width = width;
    this.max_h = max_h;
    this.max_w = max_w;
    this.floors[0] = new Floor(height, width, max_h, max_w, this);
    this.floors[0].index = 0;
  }

  add_floor(stair_room_hwyx, stair_yx) {
    this.floors[Object.keys(this.floors).length] = new Floor(this.height, this.width, this.max_h, this.max_w, this, [stair_room_hwyx, stair_yx]);
    this.floors[Object.keys(this.floors).length-1].index = Object.keys(this.floors).length - 1;
  }


}

class Floor {
  // hello darkness, my old friend
  constructor(height, width, max_h, max_w, dungeon, predef_room) {
    this.height = height;
    this.width = width;
    // max room sizes
    this.max_h = max_h;
    this.max_w = max_w;

    this.dungeon = dungeon;
    // room info stored here
    this.rooms = [];
    this.players = {};
    this.npcs = {};

    // generate initial filled grid
    this.grid = new Array(height);
    for (var y = 0; y < height; y++) {
      this.grid[y] = new Array(width);
      for (var x = 0; x < width; x++) {
        this.grid[y][x] = new Tile('solid', undefined);
      }
    }

    if (predef_room != undefined) {
      this.add_custom_starting_room(predef_room);
    } else {
      this.add_starting_room();
    }
    for (var i = 0; i < 10; i++) {
      this.add_subsequent_room();
      this.create_tunnel(this.rooms[this.rooms.length - 1], this.rooms[this.closest_room(this.rooms[this.rooms.length - 1])]);
    };

    // put stairs in random room
    var room_index = randint(0, this.rooms.length - 1)
    var room = this.rooms[room_index];
    var stairs = [randint(room.y, room.y + room.height - 1), randint(room.x, room.x + room.width - 1)];
    this.grid[stairs[0]][stairs[1]] = new Tile('down_stairs', room_index);

    this.tick();
  };

  add_floor() {
    this.dungeon.floors[Object.keys(this.dungeon.floors).length] = new Floor(this.height, this.width, this.max_h, this.max_w);
  }

  add_custom_starting_room(predef_room) {
    var stair_room_hwyx = predef_room[0];
    var stair_yx = predef_room[1];
    var height = stair_room_hwyx[0];
    var width = stair_room_hwyx[1];
    var y = stair_room_hwyx[2];
    var x = stair_room_hwyx[3];

    for (var y_loc = y; y_loc < (y + height); y_loc++) {
      for (var x_loc = x; x_loc < (x + width); x_loc++) {
        // console.log(y_loc.toString() + ' ' + x_loc.toString());
        this.grid[y_loc][x_loc] = new Tile('floor', 0);
      }
    };

    console.log('spawning up stairs at... ' + stair_yx[0].toString() + ' ' + stair_yx[1].toString());

    var floor_index = Object.keys(this.dungeon.floors).length;
    console.log(floor_index);
    this.grid[stair_yx[0]][stair_yx[1]] = new Tile('up_stairs', Object.keys(this.dungeon.floors).length);

    var room_obj = new Room(height, width, y, x, 0);
    this.rooms.push(room_obj);
  }

  add_starting_room() {
    // generate a bunch of random stuff for the room
    var height = randint(3, this.max_h);
    var width = randint(3, this.max_w);
    ////var height = (Math.random() * this.max_h | 0) + 3;
    ////var width = (Math.random() * this.max_w | 0) + 3;
    // offset of -3 and +1 are to prevent it from touching the outer wall
    var y = randint(1, this.height - height - 1);
    var x = randint(1, this.width - width - 1);
    ////var y = (Math.random() * (this.height - height - 3) | 0) + 1;
    ////var x = (Math.random() * (this.width - width - 3) | 0) + 1;

    // console.log(height);
    // console.log(width);
    // console.log(y);
    // console.log(x);

    // gouge that room into the grid!
    for (var y_loc = y; y_loc < (y + height); y_loc++) {
      for (var x_loc = x; x_loc < (x + width); x_loc++) {
        // console.log(y_loc.toString() + ' ' + x_loc.toString());
        this.grid[y_loc][x_loc] = new Tile('floor', 0);
      }
    };

    var room_obj = new Room(height, width, y, x, 0);
    this.rooms.push(room_obj);
  };


  add_subsequent_room() {
    var overlapping = true;
    var tries = 0;

  whileloop:
    while (overlapping) {
      tries++;
      // generate a bunch of random stuff for the room
      var height = randint(3, this.max_h);
      var width = randint(3, this.max_w);
      ////var height = (Math.random() * this.max_h | 0) + 3;
      ////var width = (Math.random() * this.max_w | 0) + 3;
      // offset of -3 and +1 are to prevent it from touching the outer wall
      var y = randint(1, this.height - height - 1);
      var x = randint(1, this.width - width - 1);
      ////var y = (Math.random() * (this.height - height - 3) | 0) + 1;
      ////var x = (Math.random() * (this.width - width - 3) | 0) + 1;
      // check it doesn't overlap with a current room
  roomloop:
      for (var room in this.rooms) {
        if (this.check_collision(height, width, y, x, room)) {
          // if it returns true, get out of here! it overlaps.
          continue whileloop;
        }
      }
      overlapping = false;

      if (tries > 50) {
        return false;
      }
    }

    // console.log(height);
    // console.log(width);
    // console.log(y);
    // console.log(x);

    // it isn't overlapping, fab! let's see what we can do here...
    for (var x_loc = x; x_loc < (x + width); x_loc++) {
      for (var y_loc = y; y_loc < (y + height); y_loc++) {
        // console.log(y_loc.toString() + ' ' + x_loc.toString());
        this.grid[y_loc][x_loc] = new Tile('floor', this.rooms.length);
      }
    };

    if (randint(1, 2) == 1) {
      var lava_y = randint(y, y+height);
      var lava_x = randint(x, x+width);
      this.grid[lava_y][lava_x] = new Tile('lava', this.rooms.length);
    }

    var room_obj = new Room(height, width, y, x, this.rooms.length);
    this.rooms.push(room_obj);
  };


  check_collision(h, w, y, x, room) {
    // returns true if collision, false otherwise
    for (var y_loc = y - 1; y_loc < (y + h) + 1; y_loc++) {
      for (var x_loc = x - 1; x_loc < (x + w) + 1; x_loc++) {
        if (this.grid[y_loc][x_loc].type != 'solid') {
          return true;
        }
      }
    }
    return false;
  };

  closest_room(room) {
    // returns the index of the this.rooms array containing 
    // the closest room to the input
    var closestlen = 10000000; // doesn't matter just making it big af to begin with
    var closestroomindex = -1;
    for (var i = 0; i < this.rooms.length; i++) {
      var s_room = this.rooms[i];
      var curlen = distance(room.y, room.x, s_room.y, s_room.x);
      if (curlen == 0) continue;
      if (curlen < closestlen) {
        closestlen = curlen;
        closestroomindex = i;
      }
    }
    return closestroomindex;
  };

  create_tunnel(room1, room2) {
    // pick random points inside each room
    var r1loc = [randint(room1.y, room1.y + room1.height - 1), randint(room1.x, room1.x + room1.width - 1)];
    var r2loc = [randint(room2.y, room2.y + room2.height - 1), randint(room2.x, room2.x + room2.width - 1)];
    var doorsplaced = 0;
    var current_tile;
    
    if (randint(0, 1) == 0) {
      // Abandon all hope, ye who enter here

      for (var y = r1loc[0]; y != r2loc[0]; y += (r1loc[0] < r2loc[0] ? 1 : -1)) {
        current_tile = this.grid[y][r1loc[1]];
        if (current_tile.room_index == undefined && this.grid[y-(r1loc[0] < r2loc[0] ? 1 : -1)][r1loc[1]].room_index != undefined && doorsplaced < 2) {
          current_tile.type = 'closed_door';
          doorsplaced++;
        } else if (current_tile.room_index != undefined && this.grid[y-(r1loc[0] < r2loc[0] ? 1 : -1)][r1loc[1]].room_index == undefined && doorsplaced < 2) {
          this.grid[y-(r1loc[0] < r2loc[0] ? 1 : -1)][r1loc[1]].type = 'closed_door';
          doorsplaced++;
        } else {
          current_tile.type = 'tunnel';
        }
      }
      for (var x = r1loc[1]; x != r2loc[1]; x += (r1loc[1] < r2loc[1] ? 1 : -1)) {
        current_tile = this.grid[r2loc[0]][x];
        if (current_tile.room_index == undefined && this.grid[r2loc[0]][x-(r1loc[1] < r2loc[1] ? 1 : -1)].room_index != undefined && doorsplaced < 2) {
          current_tile.type = 'closed_door';
          doorsplaced++;
        } else if (current_tile.room_index != undefined && this.grid[r2loc[0]][x-(r1loc[1] < r2loc[1] ? 1 : -1)].room_index == undefined && doorsplaced < 2) {
          this.grid[r2loc[0]][x-(r1loc[1] < r2loc[1] ? 1 : -1)].type = 'closed_door';
          doorsplaced++;
        } else {
          current_tile.type = 'tunnel';
        }
      }
    } else {
      for (var x = r1loc[1]; x != r2loc[1]; x += (r1loc[1] < r2loc[1] ? 1 : -1)) {
        current_tile = this.grid[r1loc[0]][x];
        if (current_tile.room_index == undefined && this.grid[r1loc[0]][x-(r1loc[1] < r2loc[1] ? 1 : -1)].room_index != undefined && doorsplaced < 2) {
          current_tile.type = 'closed_door';
          doorsplaced++;
        } else if (current_tile.room_index != undefined && this.grid[r1loc[0]][x-(r1loc[1] < r2loc[1] ? 1 : -1)].room_index == undefined && doorsplaced < 2) {
          this.grid[r1loc[0]][x-(r1loc[1] < r2loc[1] ? 1 : -1)].type = 'closed_door';
          doorsplaced++;
        } else {
          current_tile.type = 'tunnel';
        }
      }
      for (var y = r1loc[0]; y != r2loc[0]; y += (r1loc[0] < r2loc[0] ? 1 : -1)) {
        // dig out the tunnel
        current_tile = this.grid[y][r2loc[1]];
        if (current_tile.room_index == undefined && this.grid[y-(r1loc[0] < r2loc[0] ? 1 : -1)][r2loc[1]].room_index != undefined && doorsplaced < 2) {
          current_tile.type = 'closed_door';
          doorsplaced++;
        } else if (current_tile.room_index != undefined && this.grid[y-(r1loc[0] < r2loc[0] ? 1 : -1)][r2loc[1]].room_index == undefined && doorsplaced < 2) {
          this.grid[y-(r1loc[0] < r2loc[0] ? 1 : -1)][r2loc[1]].type = 'closed_door';
          doorsplaced++;
        } else {
          current_tile.type = 'tunnel';
        }
      }
    }
  };

  random_location(room) {
    return [randint(room.y, room.y + room.height - 1), randint(room.x, room.x + room.width - 1)];
  }

  spawn_player(player, loc) {
    this.players[player.uuid] = player;
    this.dungeon.players[player.uuid] = player;
    player.floor = this;
    if (loc == undefined) {
      var location = this.random_location(this.rooms[randint(0, this.rooms.length-1)]);
    } else {
      var location = loc;
    }
    // var location = this.random_location(this.rooms[randint(0, this.rooms.length-1)]);
    while (this.grid[location[0]][location[1]].occupied) {
      location = this.random_location(this.rooms[randint(0, this.rooms.length-1)]);
    }
    // var location = this.rooms[randint(0, this.rooms.length-1)].centre;
    player.y = location[0];
    player.x = location[1];
    if (!this.grid[player.y][player.x].occupied) {
      this.grid[player.y][player.x].occupied = player;
    }
  }

  spawn_mob() {
    var location = this.random_location(this.rooms[randint(0, this.rooms.length-1)]);
    while (this.grid[location[0]][location[1]].occupied) {
      location = this.random_location(this.rooms[randint(0, this.rooms.length-1)]);
    }
    var mob = new Mob('bob', location[0], location[1], 20, this, null, null, 1);
    this.npcs[Object.keys(this.npcs).length] = mob;
    mob.y = location[0];
    mob.x = location[1];
    if (!this.grid[mob.y][mob.x].occupied) {
      this.grid[mob.y][mob.x].occupied = mob;
    }
  }

  try_move(player, y, x) {
    // returns true if player can move, false otherwise
    if (y < 0 || x < 0 || y > this.height - 1 || x > this.width - 1) return false;
    if (!!this.grid[y][x].occupied) {
      console.log(this.grid[y][x].occupied);
      // interact with whatever entity is there lmao
      return false;
    }
    switch(this.grid[y][x].type) {
      case 'solid':
        return false;
      case 'closed_door':
        if (player instanceof Player) {
          this.grid[y][x].type = 'open_door';
        }
        // open the door
        return false;
      case 'open_door':
      case 'floor':
      case 'tunnel':
        return true;
      case 'lava':
        player.burning = true;
        return true;
      case 'up_stairs':
        // go upstairs
        if (player instanceof Player) {
          this.grid[player.y][player.x].occupied = false;
          delete this.players[player.uuid];
          this.dungeon.floors[this.index - 1].spawn_player(player, [y, x]);
          return false;
        } else { return true; }
      case 'down_stairs':
        if (player instanceof Player) {
          // console.log(Object.keys(this.dungeon.floors).length);
          // console.log(this.index);
          if (Object.keys(this.dungeon.floors).length == this.index + 1) {
            var room = this.rooms[this.grid[y][x].room_index];
            this.dungeon.add_floor([room.height, room.width, room.y, room.x], [y, x]);
            
          }
          // move player down a floor
          this.grid[player.y][player.x].occupied = false;
          // this.players = {};
          delete this.players[player.uuid];
          this.dungeon.floors[this.index + 1].spawn_player(player, [y, x]);
          // go downstairs, if it doesn't exist, make a new floor
          return false;
        } else { return true; }
    }
  }

  view(y_pos, x_pos, draw_distance) {
    var hw = draw_distance * 2 + 1;
    var ly = y_pos - draw_distance < 0 ? 0 : y_pos - draw_distance;
    var lx = x_pos - draw_distance < 0 ? 0 : x_pos - draw_distance;
    var uy = y_pos + draw_distance > this.height - 1 ? this.height - 1 : y_pos + draw_distance;
    var ux = x_pos + draw_distance > this.width - 1? this.width - 1 : x_pos + draw_distance;
    // console.log(hw.toString() + ' ' + ly.toString() + ' ' + lx.toString() + ' ' + uy.toString() + ' ' + ux.toString());
    var res = new Array(hw);
    for (var y = 0; y < uy - ly + 1; y++) {
      res[y] = new Array(hw);
      for (var x = 0; x < ux - lx + 1; x++) {
        res[y][x] = this.grid[y+ly][x+lx];
      }
    }
    return res;
  }

  tick() {
    // a tick is 1/10 second (ideally)
    var floor = this;
    var f = function() {
      // spawn a mob every 20s on average
      if (randint(1, 200) == 1) {
        floor.spawn_mob();
      }
      // loop over npcs here and make them do shit
      for (var npc in floor.npcs) {
        if (floor.npcs[npc].ticksleft == 0) {
          floor.npcs[npc].random_move();
        }
      }
      // console.log(floor.players);
      for (var player in floor.players) {
        // console.log(floor.players[player].health);
        // 
        // burn hurts 2 dmg every 2 seconds and lasts for 10 seconds on average
        if (floor.players[player].burning) {
          if (randint(1, 20) == 1) {
            floor.players[player].take_damage(2);
          } 
          if (randint(1, 100) == 1) {
            floor.players[player].burning = false;
          }
        }
        if (floor.players[player].overwatch) {
          Global.users[floor.players[player].uuid].socket.sendUTF(floor.pretty_print(floor.grid, '<br>'));
        } else {
          // Global.users[floor.players[player].uuid].socket.sendUTF(floor.pretty_print(floor.view(floor.players[player].y, floor.players[player].x, DRAW_DISTANCE), '<br>'));  
          floor.send_tilemap(floor.players[player]);
        }
        
        //console.log(floor.players[player].socket);
      }
    };
    setInterval(f, 100);
  }

  send_tilemap(player) {
    // player is a player obj, not a uuidc
    var v = this.view(player.y, player.x, DRAW_DISTANCE);
    for (var y = 0; y < v.length; y++) {
      for (var x = 0; x < v[0].length; x++) {
        if (v[y] == undefined) { v[y] = [] }
        if (v[y][x] == undefined) { v[y][x] = {type: 'abyss', sprite: 1, item: null, occupied: ''}; continue; }
        var cur = v[y][x];
        // v[y][x] = {type: cur.type, sprite: cur.sprite, item: cur.item, occupied: !!cur.occupied ? cur.occupied.constructor.name : false};
        var occupied_info = null;
        if (!!v[y][x].occupied) {
          if (v[y][x].occupied instanceof Player) {
            occupied_info = {symbol: '@', type: 'Player'};
          } else if (v[y][x].occupied instanceof Mob) {
            occupied_info = {symbol: '&', type: 'Mob'};
          }
        }
        v[y][x] = {type: cur.type, sprite: cur.sprite, item: cur.item, occupied: occupied_info != null ? JSON.stringify(occupied_info) : ''};
      }
    }
    var res = {type: "map", map: v};
    Global.users[player.uuid].socket.sendUTF(JSON.stringify(res));
  }

  pretty_print(grid, separator) {
    if (separator == undefined) separator = '\n';
    var res = '';
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[0].length; x++) {
        if (grid[y] == undefined) { res += 'X'; continue; }
        if (grid[y][x] == undefined) { res += 'X'; continue; }
        if (!!grid[y][x].occupied) {
          if (grid[y][x].occupied instanceof Player) {
            res += '@';
          } else if (grid[y][x].occupied instanceof Mob) {
            res += '&';
          }
        } else {
          switch (grid[y][x].type) {
          case 'solid':
            res += '#';
            break;
          case 'floor':
            res += '.';
            break;
          case 'closed_door':
            res += '+'
            break;
          case 'open_door':
            res += '\''
            break;
          case 'tunnel':
            res += '.'; // change to _ for more visibility
            break;
          case 'lava':
            res += '%';
            break;
          case 'up_stairs':
            res += '<';
            break;
          case 'down_stairs':
            res += '>';
            break;
          }
        }
      }
      res += separator;
    }
    return res;
  };
}

class Room {
  constructor(height, width, y, x, index) {
    this.height = height;
    this.width = width;
    this.y = y;
    this.x = x;
    this.index = index;
    this.centre = [(this.y + this.height/2) | 0, (this.x + this.width/2) | 0];
  }
}

class Tile {
  constructor(type, room_index, item) {
    this.type = type;
    this.occupied = false; // either false or an entity object or an item object... or something. fuck. FUCK.
    this.room_index = room_index;
    if (this.item == undefined) this.item = null;
    this.sprite = randint(1, 3);
  }
}

// tests

// var floor = new Dungeon(20, 20, 10, 10);
// floor.add_starting_room();

// console.log(floor.pretty_print());

// for (var i = 0; i < 5; i++) {
//   floor.add_subsequent_room();
//   console.log(floor.pretty_print());
//   floor.create_tunnel(floor.rooms[floor.rooms.length - 1], floor.rooms[floor.closest_room(floor.rooms[floor.rooms.length - 1])]);
//   console.log(floor.pretty_print());
// }

// console.log(floor.pretty_print());

exports.Dungeon = Dungeon;

