// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	body: [{}]
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	//hero.body[0].x = canvas.width / 2;
	//hero.body[0].y = canvas.height / 2;
	//resetHero();

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var resetHero = function() {
	for (i = 0; i < hero.body.length; i++){
		hero.body[i].x = canvas.width / 2;
		hero.body[i].y = canvas.height / 2;
	}
}

// Update game objects
var update = function (modifier) {

	updateHeroBody();

	if (38 in keysDown) { // Player holding up
		hero.body[0].y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.body[0].y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.body[0].x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.body[0].x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.body[0].x <= (monster.x + 32)
		&& monster.x <= (hero.body[0].x + 32)
		&& hero.body[0].y <= (monster.y + 32)
		&& monster.y <= (hero.body[0].y + 32)
	) {
		++monstersCaught;
	    hero.body[hero.body.length] = {};
		reset();
	}
};

var updateHeroBody = function() {
	for (i = hero.body.length - 1; i > 0; i--){
		hero.body[i].x = hero.body[i-1].x;
		hero.body[i].y = hero.body[i-1].y;
	}
}

var drawHeroBody = function() {
	for (i = 0; i < hero.body.length; i++){
		ctx.drawImage(heroImage, hero.body[i].x, hero.body[i].y);
	}
}
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		//ctx.drawImage(heroImage, hero.body[0].x, hero.body[0].y);
		drawHeroBody();
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
hero.body[0].x = canvas.width / 2;
hero.body[0].y = canvas.height / 2;
reset();
main();
