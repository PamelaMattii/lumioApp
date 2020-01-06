var express = require('express'); // per creazione del server
var app = express();
var https = require('https');
var fs = require('fs'); 
var arSocket;
var editorSocket;

// Cartella pubblica
app.use(express.static('pages/'));

//Loading
app.get('/loading', function(req, res){
  res.sendFile(__dirname + '/pages/loading.html');
});

// Index
app.get('/index', function(req, res){
  res.send(__dirname + '/pages/index.html');
});

// Room 1
app.get('/AnBo', function(req, res){
  res.sendFile(__dirname + '/pages/AnBo.html');
});

//Room 2
app.get('/editor', function(req, res){
  res.sendFile(__dirname + '/pages/editor.html');
});

// Room 3
app.get('/editor', function(req, res){
  res.sendFile(__dirname + '/pages/editor.html');
});


//Room 4
app.get('/editor', function(req, res){
  res.sendFile(__dirname + '/pages/editor.html');
});

//Profile
app.get('/editor', function(req, res){
  res.sendFile(__dirname + '/pages/editor.html');
});

//Settings
app.get('/editor', function(req, res){
  res.sendFile(__dirname + '/pages/editor.html');
});


// Controller  
// quando qualcuno si collega a ar fammi vedere ar.html
app.get('/ar', function(req, res){
  res.sendFile(__dirname + '/pages/ar.html');
});

// Game
// quando qualcuno si collega a editor fammi vedere editor.html
app.get('/editor', function(req, res){
  res.sendFile(__dirname + '/pages/editor.html');
});


// Credenziali https
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Creo server https
var server = https.createServer(options, app)
.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})

// Inizio gestione socket ( canale di comunicazione )

var io = require('socket.io')(server);

io.on('connection', function(socket){ 
  var url = socket.handshake.headers.referer;
  console.log(socket.handshake.headers.referer);
  if(url.indexOf("ar") >= 0){
  	console.log('a user connected');
    arSocket = socket;
    arSocket.emit("connected");
    arSocket.on("qrCodeReaded", onQrCodeReaded);
  }
  else{
  	editorSocket = socket;
  }
});


function onQrCodeReaded(data){
  if(editorSocket){

  }
}

