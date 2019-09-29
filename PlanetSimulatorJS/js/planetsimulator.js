function PlanetSimulator(boundX, boundY, numPlanets) {
    var system = [];

    this.System = system;

    //create planets

    var god = new Planet(new Vector(boundX/2, boundY / 2), 30);
    god.Velocity = new Vector(5, 0);
    god.Color = new Vector(255, 225, 0);
    this.God = god;
    system.push(god);


    for (var i = 1; i <= numPlanets; i++) {
        var r = Math.ceil(15 / (1+i) + 0.2* Math.sqrt(i));
        var pos = new Vector(rand(boundX)+boundX/2, rand(boundY)+boundY/2);
        var speed = rand(100)/r/r;
        var dir = rand(360) * 2 * Math.PI / 360;
        var vel = new Vector(speed * Math.cos(dir), speed * Math.sin(dir));
        var planet = new Planet(pos, r, vel);
        system.push(planet);
    }
    var n = 0;

    this.Update = function (deltaTime) {
        var deadPlanets = [];

        if (n < numPlanets) {
            n++;
        }

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
            system[i].Update(deltaTime);
        }
        //Check if there was a collision (note: this is done after all movement is made)
        for (var i = 0; i < system.length; i++) {
            for (var n = 0; n < system.length; n++) {
                if (n != i) {
                    if (dist(system[n].Pos.x, system[n].Pos.y, 0, system[i].Pos.x, system[i].Pos.y, 0) <= system[i].Radius + system[n].Radius) {

                        var a = 0;
                        var b = 0;

                        if (system[i].Radius >= system[n].Radius) {
                            a = i;
                            b = n;
                        }
                        else {
                            a = n;
                            b = i;
                        }

                        system[a].Radius = Math.cbrt((system[a].Mass() + system[b].Mass()) * 3 / 4 / Math.PI);
                        system[b].Radius = 0;
                        deadPlanets.push(b);

                        var force = system[b].Mass() * system[b].Acceleration();
                        var angle = Math.atan2(system[b].Pos.y - system[a].Pos.y, system[b].Pos.x - system[a].Pos.x);
                        var vectorForce = new Vector(force * Math.cos(angle), force * Math.sin(angle));
                        system[a].Force.Add(vectorForce);

                    }
                }
            }
        }

        //delete dead planets
        deadPlanets.forEach(x => system.splice(x, 1));

    };

}

function Vector(xValue, yValue, zValue) {
    this.x = xValue;
    this.y = yValue;
    this.z = zValue;

    this.Add = function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    };
    this.Subtract = function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
    };
    this.Scale = function (value) {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        return this;
    };
}

function Planet(position, radius, velocity) {
    this.Pos = position;
    this.Radius = radius;
    this.Velocity = velocity;
    //this.Color = color(rand(155) + 100, rand(155) + 100, rand(155) + 100);
    this.Color = new Vector(rand(155) + 100, rand(155) + 100, rand(155) + 100);
    this.Force = new Vector(0, 0);

   

    this.Mass = function () {
        return Math.PI * 4 / 3 * Math.pow(this.Radius, 3);
    };
    this.Acceleration = function () {
        return new Vector(this.Force.x / this.Mass(), this.Force.y / this.Mass());
    };
    this.Update = function (deltaTime) {
        this.Velocity.Add(this.Acceleration().Scale(deltaTime));
        this.Pos.x += this.Velocity.x * deltaTime;
        this.Pos.y += this.Velocity.y * deltaTime;

        //Collision check
        //if (this.Pos.x > screenWidth) {
        //    this.Velocity.x = 0;
        //    this.Pos.x = screenWidth;
        //}
        //if (this.Pos.x < 0) {
        //    this.Velocity.x = 0;
        //    this.Pos.x = 0;
        //}

        //if (this.Pos.y > screenHeight) {
        //    this.Velocity.y = 0;
        //    this.Pos.y = screenHeight;
        //}
        //if (this.Pos.y < 0) {
        //    this.Velocity.y = 0;
        //    this.Pos.y = 0;
        //}
    };

}

function rand(num) {
    return Math.floor(Math.random() * num);
}