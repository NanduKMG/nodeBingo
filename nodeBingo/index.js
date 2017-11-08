var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: true })); 

var hist = [];
var players=[];

var secretCode = "yo";

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});


app.post('/myaction', function(req, res) {
  console.log( req.body.name ); 
  if(req.body.secret === secretCode){
    players.push(req.body.name);
    res.sendFile(__dirname+'/play.html');
    res.cookie('name', req.body.name);
  }
  else{
    res.send("PHA! wrong code");
  }
});

app.get('/play', function(req, res){
res.sendFile(__dirname + '/play.html');
});


io.on('connection', function(socket){
  console.log(socket.handshake.headers['cookie'].name);
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