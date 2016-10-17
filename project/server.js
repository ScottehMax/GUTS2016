/**
 * Created by jordan on 15/10/2016.
 */

var express = require('express');
var config = require('../config.js');

var app = express();

app.set('view engine', 'ejs');

exports.startWebServer = function(port) {
  app.use(express.static('project/assets'));

  app.get('/', function(req, res) {
    res.render(__dirname + '/pages/game', config);
  });

  app.get('/text', function(req, res) {
    res.render(__dirname + '/pages/text', config);
  });

  app.listen(port);

  console.log('[WEB ] Web Server is listening on port ' + port);
};

