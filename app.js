"use strict";

// Global variables stored in here for convenience
var Global = require('./project/global.js');
var user = require('./project/user.js');
var utils = require('./project/utils.js');
var dungeon = require('./project/classes/Dungeon_Classes.js');
var player = require('./project/classes/Player.js');

var PORT = 9001;
var MAX_USERS = 20;

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(PORT, function () {
  console.log((new Date()) + ' | Server is listening on port ' + PORT);
});

// create websocket server
var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

Global.rooms[0] = new dungeon.Dungeon(30, 30, 7, 7);

wsServer.on('request', function (request) {
  console.log('someone is connecting!');

  var connection = request.accept('echo-protocol', request.origin);
  var new_user = new user.User(connection);
  var player_obj = new player.Player(null, null, null, 100,  Global.rooms[0], null, null, 0, connection);
  new_user.player = player_obj;
  player_obj.user = new_user;
  connection.player = player_obj;

  Global.rooms[0].spawn_player(player_obj);

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

    console.log(cmd);

    switch(cmd.type) {
    case 'move':
      // console.log(Global);
      Global.users[cmd.uuid].player.move(cmd['dir']);
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

