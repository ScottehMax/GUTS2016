"use strict";

var utils = require('./utils.js');
var Global = require('./global.js');

class User {
  constructor(socket) {
    this.socket = socket;
    this.uuid = utils.uuid();

    Global.users[this.uuid] = this;

    this.name;
    this.player;
  }

  destroy() {
    // called on socket close
    var user = Global.users[this.uuid];
    user.player.erase();
    delete Global.users[this.uuid];
    console.log(this.uuid + ' destroyed.');

  }
}

exports.User = User;