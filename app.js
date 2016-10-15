"use strict";

// Global variables stored in here for convenience
var Global = require('./project/global.js');
var user = require('./project/user.js');
var utils = require('./project/utils.js');

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

wsServer.on('request', function (request) {
  console.log('someone is connecting!');

  var connection = request.accept('echo-protocol', request.origin);
  var new_user = new user.User(connection);
  connection.sendUTF(JSON.stringify({'uuid': new_user.uuid}));
  // console.log(request);
});