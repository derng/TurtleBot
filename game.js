
var cBkgd = document.getElementById('canvasBg');
var cxtBkgd = cBkgd.getContext('2d');

var cTurtle = document.getElementById('canvasTurtle');
var cxtTurtle = cTurtle.getContext('2d');

var btnReset = document.getElementById('btnReset');
btnReset.addEventListener('click', reset, false);

var cWidth = cBkgd.width;
var cHeight = cBkgd.height;
var FPS = 10;
var drawInterval;
var mouseDown = false;

var imgSprite = new Image();
imgSprite.src = 'images/turtle.png';
imgSprite.addEventListener('load', init, false);

var turtle;

/////////////////////////////////////////////////////////////////////////

function init() {
	startDrawing();
	turtle = new Turtle();
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('mousedown', onMousePress, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mouseup', onMouseUp, false);
	reset();
}

function reset() {
	cxtBkgd.clearRect(0,0,cWidth,cHeight);
	turtle.reset();
}
	
function startDrawing() {
	stopDrawing();
	drawInterval = setInterval(update,FPS);
}

function stopDrawing() {
	clearInterval(drawInterval);
}

function update() {
	turtle.display();
}

/////////////////////////////////////////////////////////////////////////
//Events

function onKeyDown(e) {
	var keyID = (e.keyCode) ? e.keyCode : e.which;
	if (keyID == 37) { //Left
		turtle.rotate(false);
	}
	if (keyID == 38) { //Up
		turtle.onMove(true);
	}
	if (keyID == 39) { //Right
		turtle.rotate(true);
	}
	if (keyID == 40) { //Down
		turtle.onMove(false);
	}
	e.preventDefault();
}

function onMousePress(e) {
	mouseDown = true;
}

function onMouseMove(e) {
	if (mouseDown) {
		var x = e.x;
		var y = e.y;
		x -= cBkgd.offsetLeft;
		y -= cBkgd.offsetTop;
		turtle.movePoint(x, y);
	}
}

function onMouseUp(e) {
	mouseDown = false;
}

/////////////////////////////////////////////////////////////////////////
//Class Turtle

function Turtle() {
	this.srcX = 0;
	this.srcY = 0;
	this.x = 0;
	this.y = 0;
	this.width = 48;
	this.height = 50;
	this.speed = 5;
	this.aSpeed = 4;
	this.angle = 0;
}

Turtle.prototype.reset = function() {
	this.x = (cWidth - this.width)/2;
	this.y = (cHeight - this.height)/2;
	this.angle = 0;
}

Turtle.prototype.display = function() {
	cxtTurtle.save();
	cxtTurtle.clearRect(0,0,cWidth,cHeight);
	var w = this.x+this.width/2;
	var h = this.y+this.height/2;
	cxtTurtle.translate(w, h);
	cxtTurtle.rotate(this.angle*Math.PI/180);
	cxtTurtle.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,-this.width/2,-this.height/2,this.width,this.height);
	cxtTurtle.rotate(-this.angle*Math.PI/180);
	cxtTurtle.translate(-w, -h);
	cxtTurtle.restore();
}

Turtle.prototype.movePoint = function(x, y) {
	var px = x - (this.x+this.width/2);
	var py = (this.y+this.height/2) - y;
	
	if (px == 0 && py == 0) {
		return;
	}
	
	if (py == 0) {
		if (px > 0) 
			this.angle = 90;
		else 
			this.angle = 270;
	} else if (px == 0){
		if (py > 0) 
			this.angle = 0;
		else
			this.angle = 180;
	} else {
		var a = Math.atan(px/py)*180/Math.PI;
		if (py < 0) {
			a += 180;
		} else if (px < 0 && py > 0) {
			a += 360;
		}
		
		this.angle = a;
	}
	
	this.onMove(true);
}

Turtle.prototype.onMove = function(up) {
	var dx = this.speed*Math.sin(this.angle*Math.PI/180);
	var dy = this.speed*Math.cos(this.angle*Math.PI/180);
	if (up) {
		this.x += dx;
		this.y -= dy;
	} else {
		this.x -= dx;
		this.y += dy;
	}
	this.postMove();
}

Turtle.prototype.postMove = function() {
	//Collision Correction
	if (this.y < 0) this.y = 0;
	else if (this.y+this.height > cHeight) 
		this.y = cHeight-this.height;
		
	if (this.x < 0) this.x = 0;
	else if (this.x+this.width > cWidth)
		this.x = cWidth-this.width;
		
	//Plot point on background
	var px = this.x+this.width/2;
	var py = this.y+this.height/2;
	cxtBkgd.beginPath();
	cxtBkgd.arc(px, py, 3, 0, 2*Math.PI);
	cxtBkgd.strokeStyle = '#FFFFFF';
	cxtBkgd.stroke();
}

Turtle.prototype.rotate = function(right) {
	if (right) {
		this.angle += this.aSpeed;
	} else {
		this.angle -= this.aSpeed;
	}
	this.angle = this.angle % 360;
}