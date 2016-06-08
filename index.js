const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const queue = require('d3-queue').queue();
const _ = require('underscore-node');
const crypto = require('crypto');
const fs = require('fs');

app.get('/', function(req, res){
  var roomId = generateRoomId();
  setUpNamespace(roomId);
  fs.readFile('/dockerized/blah.html', 'utf8', (err, html) => {
    page = _.template(html)({roomId:roomId});
    res.send(page);
  });
});

function setUpNamespace(roomId){
  var channelIo = io.of('/' + roomId);
  channelIo.on('connection', function(socket){
    socket.on('draw-line', function(oldCoords, newCoords){
      queue.defer(function(start, end, callback){
        channelIo.emit('draw-line', {start : oldCoords, end : newCoords}); 
      }, oldCoords, newCoords);
    });
  });
}

function generateRoomId(){
  var hash = crypto.createHash('sha256');
  hash.update((new Date()).toString() + Math.random().toString());
  return hash.digest('hex').substring(0, 6);
}

app.use(express.static(__dirname));

io.on('connection', function(socket){
  socket.on('draw-line', function(oldCoords, newCoords){
    queue.defer(function(start, end, callback){
      io.emit('draw-line', {start : oldCoords, end : newCoords}); 
    }, oldCoords, newCoords);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
