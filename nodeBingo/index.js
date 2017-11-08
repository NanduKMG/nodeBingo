var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var hist = [];

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

app.get('/play', function(req, res){
res.sendFile(__dirname + '/play.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('numClick', function(msg){
    console.log('message: ' + msg);
    io.emit('numClick',msg);
    hist.push(msg);
    console.log(hist);	
  });

  socket.on('reload',function(){
  	console.log("reload called at server");
  	socket.emit('reload',hist);
  });



});


http.listen(3000, function(){
  console.log('listening on *:3000');
});