/// <reference path="jquery-3.1.0.js" />
/// <reference path="p5.js" />

var screenWidth = 1820;
var screenHeight = 800;
var system = [];
var lastFrameTime = 0;
var deltaTime = 0;
var timeSpeed = 1; //1 = 100%

function setup(){
 	createCanvas(screenWidth, screenHeight);
 	background(0);
    
 	var r = 0;
	var god = new Planet(50);
	god.Velocity = new Vector(20,0);
	god.Pos = new Vector(0, screenHeight/2);
	god.Color = color(255, 225,0);
	
	system.push(god);
	for(var i=1; i <= 70; i++){
	    system.push(new Planet(r));
	    r = Math.ceil(20/ (i) + 0.2*i);
	    //r = 50 - (5 * i);
	}
}

function draw() {
    //update Delta Time
    deltaTime = timeSpeed * (millis() - lastFrameTime)/1000;

    //Perform calculations
    update();

    //Draw background
    fill(0, 0, 0);
    rect(0, 0, screenWidth, screenHeight);

    //Draw all planets
    for (var i = 0; i < system.length; i++) {
        system[i].Draw();
    }

    //update lastFrameTime
    lastFrameTime = millis();
}
function update() {

    //Calculate Force->Acceleration->Movement
    for (var i = 0; i < system.length; i++) {
        var xForce = 0;
        var yForce = 0;

        for (var n = 0; n < system.length; n++) {
            if (n != i) {

                distance = dist(system[n].Pos.x, system[n].Pos.y, system[i].Pos.x, system[i].Pos.y);
                if (distance >= 1) {
                    var force = system[n].Mass() * system[i].Mass() / (Math.pow(distance, 2));
                    var angle = Math.atan2(system[n].Pos.y - system[i].Pos.y, system[n].Pos.x - system[i].Pos.x);
                    xForce += force * Math.cos(angle);
                    yForce += force * Math.sin(angle);
                }
            }
        }
        system[i].Force = new Vector(xForce, yForce);
        system[i].Update();
    }
    //Check if there was a collision (note: this is done after all movement is made)
    for (var i = 0; i < system.length; i++) {
        for (var n = 0; n < system.length; n++) {
            if (n != i) {
                if (dist(system[n].Pos.x, system[n].Pos.y, 0, system[i].Pos.x, system[i].Pos.y, 0) <= system[i].Radius + system[n].Radius) {
                   
					var a = 0;
					var b = 0;
					
					if(system[i].Radius >= system[n].Radius){
						a = i;
						b = n;
					}
					else {
						a = n;
						b = i;
					}
					
					system[a].Radius = Math.cbrt(4 * (system[a].Mass() + system[b].Mass()) / 3 / Math.PI);
                    system[b].Radius = 0;
					
					var force = system[b].Mass()*system[b].Acceleration();
					var angle = Math.atan2(system[b].Pos.y - system[a].Pos.y, system[b].Pos.x - system[a].Pos.x);
                    var vectorForce = new Vector(force * Math.cos(angle), force * Math.sin(angle));
					system[a].Force.Add(vectorForce);
					
                }
            }
        }
    }

}

var frame = false;
function touchEnded() {
    if (frame == false) {
        timeSpeed = 10;
        frame = true;
    }
    else {
        timeSpeed = 10;
        frame = false;
    }
}

//Classes
function Vector(xValue, yValue) {
    this.x = xValue;
    this.y = yValue;
	this.Add = function (vector){
		this.x += vector.x;
		this.y += vector.y;
		return this;
	};
	this.Subtract = function (vector){
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	};
	this.Scale = function (value){
		this.x *= value;
		this.y *= value;
		return this;
	};
}
function Planet(radius){
	this.Pos = new Vector(random(screenWidth), random(screenHeight));
	this.Radius = radius;
	this.Color = color(random(155)+100, random(155)+100, random(155)+100);
	this.Force = new Vector(0, 0);
	this.Velocity = new Vector(random(60)-30,random(60)-30);
	
	this.Mass = function () {
	    return Math.PI * 3 / 4 * this.Radius * this.Radius * this.Radius; 
	};
	this.Acceleration = function () {
	    return new Vector(this.Force.x / this.Mass(), this.Force.y / this.Mass());
	};
	this.Update = function () {
		this.Velocity.Add(this.Acceleration().Scale(deltaTime));
	    this.Pos.x += this.Velocity.x*deltaTime;
	    this.Pos.y += this.Velocity.y*deltaTime;

	    //Collision check
	    if (this.Pos.x > screenWidth){
	        this.Velocity.x = 0;
	        this.Pos.x = screenWidth;
	    }
	    if (this.Pos.x < 0) {
	        this.Velocity.x = 0;
	        this.Pos.x = 0;
	    }

	    if (this.Pos.y > screenHeight) {
	        this.Velocity.y = 0;
	        this.Pos.y = screenHeight;
	    }
	    if (this.Pos.y < 0) {
	        this.Velocity.y = 0;
	        this.Pos.y = 0;
	    }
	};
	this.Draw = function() {
		fill(this.Color);
		ellipse(this.Pos.x, this.Pos.y, this.Radius * 2, this.Radius * 2);
	};
}

