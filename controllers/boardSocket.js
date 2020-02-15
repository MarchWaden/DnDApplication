module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('SquareChange', function(square){
      io.emit('SquareChange', square);
    });
  });
}
