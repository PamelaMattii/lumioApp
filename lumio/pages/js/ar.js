
var videoReader;
var canvas;
var canvasContext;
var socket;
var socketConnected = false;


navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
                         navigator.mediaDevices.webkitGetUserMedia ||
                         navigator.mediaDevices.mozGetUserMedia;

document.addEventListener('DOMContentLoaded', function(){ 
   setup();
}, false);


// disegna le linee intorno al qr
function drawLine(begin, end, color) {
	canvasContext.beginPath();
	canvasContext.moveTo(begin.x, begin.y);
	canvasContext.lineTo(end.x, end.y);
	canvasContext.lineWidth = 4;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
}

function setup(){
	videoReader = document.querySelector("#videoReader");
	canvas = document.querySelector("canvas");
	canvasContext = canvas.getContext("2d");
	setupSocket();
}

function setupSocket(){
	socket = io();
	socket.on("connected", onSocketConnected);
}

function onSocketConnected(){
	console.log('a user connected');
	socketConnected = true;
	socket.on('disconnect', onSocketDisconnected);
	readQrCode();
}

function onSocketDisconnected(){
	socketConnected = false;
	console.log('user disconnected');
	if(videoReader){
		videoReader.srcObject = null;
	}
}


function readQrCode(){
	navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      videoReader.srcObject = stream;
      videoReader.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      videoReader.play();
      requestAnimationFrame(tick);
    });
}



function tick(){
	if (videoReader.readyState === videoReader.HAVE_ENOUGH_DATA) {
		canvas.height = videoReader.videoHeight;
		canvas.width = videoReader.videoWidth;
		canvasContext.drawImage(videoReader, 0, 0, canvas.width, canvas.height);
		var imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
		console.log(imageData);
		var code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});
		if(code){
			console.log("Found");
			alert(code.data); // spara fuori quello che sta scritto nel code
			drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
			drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
			drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
			drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
			onQrCodeDetected(code.data);
		}
		else{

		}
	}
	requestAnimationFrame(tick);
}

function onQrCodeDetected(code){
	videoReader.srcObject = null;
	createScene(code);
	//document.body.classList.add("playGame");
	//socket.emit("qrCodeReaded", {"code": code});
	
}


// dentro l'array ci sono vari elementi 
function createScene(code){
	//code: M01_x43_y10--M02_x43_y10
	var tempObjs = code.split("--");
	//code: M01_x43_y10, M02_x43_y10
	console.log(tempObjs);
	var objectArr = [];


	for(var a = 0; a < tempObjs.length; a++){
		var tempString = tempObjs[a];
		var idOggetto = parseInt(tempString.substring(1,3));

	/*var x = parseInt(tempString.substring(5,7));
		var y = parseInt(tempString.substring(9,11));*/

		var x = 0;  // posizione del 3d obj
		var y = 0;  // posizione del 3d obj
		var tempStructure = {
			idOggetto: idOggetto,
			x: x,
			y: y
		}
		objectArr.push(tempStructure);
	}
	console.log(objectArr);


	var scene3DString =  ` <a-scene embedded vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;">

	<a-assets>
    <a-asset-item id="animated-asset" src="https://raw.githubusercontent.com/nicolocarpignoli/nicolocarpignoli.github.io/master/ar-playground/models/CesiumMan.gltf"></a-asset-item>
  </a-assets>
	

	<a-marker id="animated-marker" type='barcode' value='6'>`;
	for(var a = 0; a < objectArr.length; a++){
		var oggType = objectArr[a].idOggetto;
		var coordX = objectArr[a].x;
		var coordY = objectArr[a].y;

		switch(oggType){
			// 1 = M01
			case 1:
				scene3DString += `<a-box position='${coordX} ${coordY} 0' color="yellow"></a-box>`;
				break;
			// 2 = M02
				case 2:		
				scene3DString +=   `<a-entity
				animation-mixer
				gltf-model="#animated-asset"
				position = '${coordX} ${coordY} 0'
				scale="2 2 2">
				</a-entity>`;
			break;

		}

	}	
	scene3DString +=`</a-marker>
	<a-entity camera></a-entity>
	</a-scene>`;

	scene3DString +=`<div id="qr-instructions-two">
          <h3> Inquadra per terra </h3>
			</div>`;

	document.body.innerHTML = scene3DString;
}


// ISTRUZIONI SULL'APP CHE VANNO VIA DOPO n SECONDI

setTimeout(function(){
	document.getElementById('qr-instructions').style.display='none';
}, 2000);

setTimeout(function(){
	document.getElementById('qr-instructions-two').style.display='none';
}, 3000);

