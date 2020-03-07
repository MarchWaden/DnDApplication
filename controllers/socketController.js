const Game = require('../models/game');
const User = require('../models/user');

module.exports = function(io){
//Chat Functions

  //Printing out chat messages in server log
  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
  });
  //Emits chat message to all connected sockets when one is recieved
  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });


//Old Board Functions
  io.on('connection', function(socket){
    socket.on('SquareChange', function(square){
      io.emit('SquareChange', square);
    });
  });

//Everything Modern


};
