var socket;
var socketConnected = false;

document.addEventListener('DOMContentLoaded', function(){ 
   setup();
}, false);


function setup(){
	console.log("Hi!");
	generateQRCode();
  setupSocket();
}


function setupSocket(){
	socket = io();
	socket.on("connected", onSocketConnected);
}


function onSocketConnected(){
	socketConnected = true;
	socket.on('disconnect', onSocketDisconnected);
}

function onSocketDisconnected(){
	socketConnected = false;
}

function generateQRCode(){
	var qrCanvas = document.querySelector('.qrCode');
	var qr = new QRious({
		element: qrCanvas,
		value: "M01_x13_y01--M02_x04_y04--M02_x34_y24"
	});	
}


