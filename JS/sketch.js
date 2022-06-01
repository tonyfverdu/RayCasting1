//  Variables generales:
let walls = [];
let ray;
let particle;
let xoff = 0;
let yoff = 10000;

let randomBackgroundColor = Math.floor(Math.random() * 30);

// Class "Limite - Boundary" simple (2 vectores)
class Boundary {
	constructor (x1, x2, y1, y2) {
		this.a = createVector(x1, y1);  //  Vector a (begin of line of wall)
		this.b = createVector(x2, y2);  //  Vector b (end of line of wall)
	}

	show() {							//  print 2 Vector - a line  -----------
		stroke(255);
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
}

//  Class "Ray" (rayos) desde 
class Ray {
	constructor (pos, angle) {   //  A ray ist a Vector, wit origin: pos(x, y) y a angle (0deg, 360deg)
		this.pos   = pos;		//  in pos(x, y)
		this.angle = angle;		//  beetwen 0deg and 360deg

		this.dir = p5.Vector.fromAngle(this.angle);  // direction of ray with a vector (or angle too).
	}

	show() {					//  method print ray, ein line of vector ray
		stroke(255);
		push();
		translate(this.pos.x, this.pos.y);	// translate to pos(x,y)
		line(0, 0, this.dir.x, this.dir.y);	// the direction of ray
		pop();
	}

	cast (wall) {				//  method "cast": intersection de ray (pos and dir) with wall (a and b)
		const x1 = wall.a.x;	//  (x1, y1, x2, y2) coordenadas of the wall
		const y1 = wall.a.y;
		const x2 = wall.b.x;
		const y2 = wall.b.y;

		const x3 = this.pos.x;			// (x3, y3, x4, y4) coordenadas of ray-line
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;
										//  Algoritmo of intersection 2 lines
		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den === 0) {
			return;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

		if (t > 0 && t < 1 && u > 0) {		// point of the intersection.
			 const pt = createVector();
			 pt.x = x1 + t * (x2 - x1);
			 pt.y = y1 + t * (y2 - y1)
			 return pt;
		} else {
			return;
		}
	}
}

class Particle {			// some rays, 360deg, array of objekts rays origen pos (position)
	constructor () {
		this.pos = createVector(width / 2, height / 2);
		this.rays = [];
		for (let ang = 0; ang < 360; ang ++) {
			this.rays.push(new Ray (this.pos, radians(ang))); // a instance of object "ray" intro array of rays
		}
	}

	update (x, y) {			
		this.pos.set(x, y);
		// randomBackgroundColor = Math.floor(Math.random() * 50);
	}

	look(walls) {			
		for (let i = 0; i < this.rays.length; i++) {
			const ray = this.rays[i];
			let closest = null;
			let record  = Infinity;

			for (let wall of walls) {
				const pt = ray.cast(wall);
				if (pt) {
					const d = p5.Vector.dist(this.pos, pt);
					if (d < record) {
						record  = d;
						closest = pt;
					}
				}
			}
			if (closest) {
				colorMode (HSB);
				stroke((i + frameCount * 3) % 360, 255, 255, (i + frameCount * 3) % 360);
				//stroke(255, 90);
				line(this.pos.x, this.pos.y, closest.x, closest.y);
			}
		}
	}

	show() {
		for (let i = 0; i < this.rays.length; i++) {
			fill((i + frameCount * 3) % 360, 255, 255, (i + frameCount * 3) % 360);
			ellipse(this.pos.x, this.pos.y, 15);  //  ellipse of point 
			
		}
		for (let ray of this.rays) {
			ray.show();
		}
	}
}

function setup() 					//  function setup of p5.js library, initialization objects
{
	createCanvas(1600, 804);
	for (let i = 0; i < 12; i++) {
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);
		walls[i] = new Boundary(x1, y1, x2, y2);  //  array of 12 walls
	}
	walls.push(new Boundary(0, 0, width, 0));			//  definition of limit of walls of canvas
	walls.push(new Boundary(width, 0, width, height));
	walls.push(new Boundary(width, height, 0, height));
	walls.push(new Boundary(0, height, 0, 0));
	particle = new Particle();	// Init particles of rays
}


function draw() {	//  function draw() of library p5.js)
	randomBackgroundColor = noise(Math.floor(Math.random() * xoff )) * 20;
	//  console.log('randomBackgroundColor: ' + randomBackgroundColor); 
	background(randomBackgroundColor);
	stroke(255);
	for (let wall of walls) {
		wall.show();			//  Show of walls
	}

	//particle.update(mouseX, mouseY);  // control with mouse
	particle.update(noise(xoff) * width, noise(yoff) * height);  //  random with noise
	particle.show();
	particle.look(walls);

	xoff += 0.015;
	yoff += 0.015;
}

document.addEventListener ( 'click', (e) => {
	for (let i = 0; i < 12; i++) {
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);
		walls[i] = new Boundary(x1, y1, x2, y2);  //  array of 12 walls
	}
	walls.push(new Boundary(0, 0, width, 0));			//  definition of limit of walls of canvas
	walls.push(new Boundary(width, 0, width, height));
	walls.push(new Boundary(width, height, 0, height));
	walls.push(new Boundary(0, height, 0, 0));
	particle = new Particle();	// Init particles of rays
	for (let wall of walls) {
		wall.show();			//  Show of walls
	}
});