var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true })); 

var hist = [];
var players=[];
var userOrder={} ;//Object storing username:order array
var nums = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'];


var secretCode = "yo";

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});


app.post('/myaction', function(req, res) {
  
  if(req.body.secret === secretCode){
    players.push(req.body.name);
    console.log(players);
    console.log("PLAYERS LIST:"+players);
    res.sendFile(__dirname+'/play.html');
    res.cookie('name', req.body.name);

    console.log(userOrder[req.body.name]);
    //make new random order for that user
    
    if(userOrder[req.body.name]===undefined){
      nums.sort(function(a, b){return 0.5 - Math.random()});
      console.log('ifil keri!');
    userOrder[req.body.name]=nums;}
    else{
      console.log('ifil keriyilla!');
    }

    console.log(userOrder);
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
  var pos=-1;
  var username;

  for (var i = usernamecookies.length - 1; i >= 0; i--) {
    if(usernamecookies[i].search("name")>0){
        pos=i;
        console.log(usernamecookies[i]);
        break;
    }
  }

  username = usernamecookies[pos].slice(6);
  console.log(username+" started connection");
  //console.log('a user connected');
  socket.on('disconnect', function(){
    console.log(username +' disconnected');
  });

  socket.on('numClick', function(msg){
    console.log('message: ' + msg);
    io.emit('numClick',msg);
    hist.push(msg);
    console.log(hist);	
  });

  socket.on('reload',function(){
    //order for this user
    var order = userOrder[username];
    console.log(order +'was send from server');
  	console.log("reload called at server");
  	socket.emit('reload',hist,username,order);
  });



});


http.listen(3000, function(){
  console.log('listening on *:3000');
});