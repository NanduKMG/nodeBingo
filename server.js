'use strict';
/*
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express();
  //.get('/play',(req,res) => res.sendFile(__dirname+'/play.html'))
 /* .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  
var app = express();


server.get('/play', function(req, res){
res.sendFile(__dirname + '/play.html');
});


server.get('/play2', function(req, res){
res.sendFile(__dirname + '/play2.html');
});

server.listen(PORT,function(){
	console.log('listenong here also!');
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


*/
const PORT = process.env.PORT || 3000;
var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true })); 

var hist = [];
var players=[];
var userOrder={} ;//Object storing username:order array
var nums = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'];
var turn=0;


var secretCode = "yo";



//reset game condition
function reset(){
  hist.length=0;
  userOrder.length=0;
  turn=0;
  players.length=0;

}

//suggle algorithm
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}





app.get('/reset', function(req, res){
res.send("Okay reseteyth.");
reset();
console.log(players,hist,turn);
});

app.get('/anime.min.js', function(req, res){
res.sendFile(__dirname + '/anime.min.js');
});


app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});


app.post('/myaction', function(req, res) {
  console.log('my action ethi!');
  console.log(req.body);
  if(req.body.secret === secretCode){
    if(!players.includes(req.body.name)){
    players.push(req.body.name);
    console.log('New player added to players:'+players);
    //console.log("His turn is :"+turn);
    //turn++;
    }
    
    res.sendFile(__dirname+'/play.html');
    res.cookie('name', req.body.name);

    //console.log(userOrder[req.body.name]);
    //make new random order for that user
    
    if(userOrder[req.body.name]===undefined){
      console.log('Creating New random bingo order for you...');
      
      //console.log(req.body.name);
      
      userOrder[req.body.name]=shuffle(nums.slice(0));
      console.log(userOrder[req.body.name]);
      //console.log('nums is '+nums);
      //console.log(userOrder);
  }

    else{
      console.log('User already there so not creating random order');
    }

    //console.log(userOrder);
  }
  else{
    res.send("PHA! wrong code");
  }
});

app.get('/play', function(req, res){
res.sendFile(__dirname + '/play.html');
});


app.get('/play2', function(req, res){
res.sendFile(__dirname + '/play2.html');
});


io.on('connection', function(socket){
  //console.log(cookieParser.parse(socket.handshake.headers['cookie']));
  console.log('\n \n');


  //find user name
  var usernamecookies = socket.handshake.headers['cookie'].split(';');
  //console.log('usernamecookies:'+usernamecookies[0]);
  var pos=-1;
  var username;
  var hisTurn = players.indexOf(username);
  var brdOn=0;
  for (var i = usernamecookies.length - 1; i >= 0; i--) {
    //console.log('usernamecookies:'+usernamecookies[i]);
    if(usernamecookies[i].search("name")>=0){
        pos=i;
        //console.log(usernamecookies[i]+'is the value here');
        break;
    }
  }
  
 
  username = usernamecookies[pos].slice(usernamecookies[pos].search("=")+1);
  console.log(username+" started connection");
  //console.log('a user connected');
  socket.on('disconnect', function(){
    console.log(username +' disconnected');
  });

    //chumma send fellow players list!
  io.emit('othPlayers',players);

  socket.on('numClick', function(msg){
    console.log(username + 'message: ' + msg);
    turn = (turn + 1)%players.length;
    console.log('now of turn of player :'+players[turn])
    
    io.emit('numClick',msg,players[turn]);
    hist.push(msg);
    console.log(hist);
    
    console.log("next turn:"+turn);	
  });

  socket.on('win', function(msg){
    console.log(msg+" won reported!");
    io.emit('win',msg);
   
  });

  socket.on('reload',function(){
    //order for this user
    var order = userOrder[username];
    console.log(order +'was send from server');
  	console.log(username + "reload called at server");
  	socket.emit('reload',hist,username,order,players[turn]);
  });



});


http.listen(PORT, function(){
  console.log('listening on *:3000');
});


