/// <reference path="jquery-3.1.0.js" />
/// <reference path="p5.js" />

var screenWidth = 600;
var screenHeight = 600;
var lastFrameTime = 0;
var timeSpeed = 10; //1 = 100%
var isTouching = false;
var cam = new Vector(300, 300, 1);
var camOffset = null;
var sim = null; 

function setup() {
    createCanvas(screenWidth, screenHeight);
    background(0);
    sim = new PlanetSimulator(screenWidth/8 , screenHeight/8, 200);
}
function draw() {
    //update Delta Time
    var deltaTime = timeSpeed * (millis() - lastFrameTime) / 1000;

    //Perform calculations
    sim.Update(deltaTime);
    camOffset = new Vector(-screenWidth / 2, -screenHeight / 2);
    cam = camOffset.Add(sim.God.Pos);

    //Draw background
    fill(0, 0, 0);
    rect(0, 0, screenWidth, screenHeight);

    //Draw all planets
    for (var i = 0; i < sim.System.length; i++) {
        drawPlanet(sim.System[i]);
    }

    console.log("Num planets: " + sim.System.length);

    //update lastFrameTime
    lastFrameTime = millis();
}

function drawPlanet(planet) {
    //make hidden property to store p5 color, kinda ugly
    if (planet.$color === undefined) {
        planet.$color = color(planet.Color.x, planet.Color.y, planet.Color.z);
    }

    fill(planet.$color);
    ellipse(planet.Pos.x - cam.x, planet.Pos.y - cam.y, planet.Radius * 2, planet.Radius * 2);
}

var frame = false;
function touchEnded(event) {
    console.log(event);
    if (frame == false) {
        timeSpeed = 20;
        frame = true;
    }
    else {
        timeSpeed = 1;
        frame = false;
    }
}
function touchStarted(event) {
    console.log(event);

    isTouching = true;
}



