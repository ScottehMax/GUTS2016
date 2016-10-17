"use strict";

// Global variables stored in here for convenience
var Global = require('./project/global.js');
var config = require('./config.js');
var user = require('./project/user.js');
var utils = require('./project/utils.js');
var chain = require('./project/chain.js');
var dungeon = require('./project/classes/Dungeon_Classes.js');
var player = require('./project/classes/Player.js');

require('./project/server.js').startWebServer(config.WEB_PORT);

var MAX_USERS = 20;

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(config.SOCKET_PORT, function () {
  console.log('[SCKT] WebSocket Server is listening on port ' + config.SOCKET_PORT);
});

// create websocket server
var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

Global.rooms[0] = new dungeon.Dungeon(40, 40, 9, 9);

wsServer.on('request', function (request) {
  console.log('someone is connecting!');

  var connection = request.accept('echo-protocol', request.origin);
  var new_user = new user.User(connection);
  var player_obj = new player.Player(chain.gen_name(), null, null, 100, null, null, null, 1, 'player1');
  new_user.player = player_obj;
  player_obj.uuid = new_user.uuid;
  connection.player = player_obj;

  // Global.rooms[0].spawn_player(player_obj);

  // create player
  // assign to room
  connection.uuid = new_user.uuid;
  connection.sendUTF(JSON.stringify({'uuid': new_user.uuid}));
  // console.log(request);
  connection.on('message', function (message) {
    console.log('msg received!');
    var cmd;
    try {
      cmd = JSON.parse(message.utf8Data);
    } catch (e) {
      console.log("YOU BUGGERED IT: " + e);
      connection.sendUTF('Error: invalid JSON');
      cmd = {};
    }

    // console.log(cmd);

    switch(cmd.type) {
    case 'move':
      // console.log(Global);
      // console.log(Global);
      Global.users[cmd.uuid].player.move(cmd['dir']);
      break;
    case 'get_rooms':
      var room_data = {type: 'room_info', rooms: []}
      for (var room in Global.rooms) {
        room_data.rooms.push({index: room, players: Object.keys(Global.rooms[room].players).length});
      }
      console.log(room_data);
      connection.sendUTF(JSON.stringify(room_data));
      break;
    case 'join':
      Global.rooms[cmd.room_index].floors[0].spawn_player(connection.player);
      break;
    case 'create':
      var newdungeon = new dungeon.Dungeon(40, 40, 9, 9);
      Global.rooms[Object.keys(Global.rooms).length] = newdungeon;
      newdungeon.floors[0].spawn_player(connection.player);
      break;
    }
    // var connection = request.accept('echo-protocol', request.origin);
    // var new_user = new user.User(connection);
    // connection.sendUTF(JSON.stringify({'uuid': new_user.uuid}));
    // console.log(request);
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    console.log(connection.uuid);
    if(Global.users[connection.uuid]) Global.users[connection.uuid].destroy();
  });
});
