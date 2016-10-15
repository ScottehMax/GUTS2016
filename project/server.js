/**
 * Created by jordan on 15/10/2016.
 */

var express = require('express');
var app = express();

exports.startWebServer = function(port) {
  app.use(express.static('project/assets'));

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/pages/game.html');
  });

  app.listen(port);

  console.log('[WEB ] Web Server is listening on port ' + port);
};

