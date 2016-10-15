/**
 * Created by jordan on 15/10/2016.
 */

var express = require('express');
var app = express();

app.use(express.static('assets'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/pages/game.html');
});

app.listen(3000);

console.log("Running at Port 3000");