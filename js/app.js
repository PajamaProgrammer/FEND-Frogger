//Global Variables
var gameLevel = 1;
var soundOn = true;

//Canvas Size
var canvasWidth = 505;
var canvasHeight = 606;

//Player Offsets
var offsetX = (canvasWidth/5)/2;
var offsetY = (canvasHeight/6)/2;

//Enemy Rows
var ROW = [60, 145, 225];

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';

    this.speed = this.randomSpeed();
    //console.log(this.speed);
    this.y = ROW[Math.floor(Math.random()*3)];
    this.x = -100;
};

Enemy.prototype.randomSpeed = function () {
    var minSpeed = 25*gameLevel, maxSpeed = 200*gameLevel;
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
    if (this.x > canvasWidth)
    {
        this.speed = this.randomSpeed();
        //console.log(this.speed);
        this.y = ROW[Math.floor(Math.random()*3)];
        this.x = -100;
    }
    //console.log(this.x, this.y);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.x = canvasWidth / 2 - offsetX;
    this.y = canvasHeight / 2;
    this.sprite = 'images/char-boy.png';
    //this.newGame();
    //this.reset();
};

Player.prototype.update = function(dt) {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    console.log(key, this.x, this.y);
    var movX = canvasWidth/5;
    var movY = (canvasHeight - 100)/6;
    switch (key)
    {
        case "left":
            console.log("You pressed left");
            if (this.x - movX > -5)
                this.x -= movX;
            break;
        case "right":
            console.log("You pressed right");
            if (this.x + movX < 410)
                this.x += movX;
            break;
        case "up":
            console.log("You pressed up");
            if (this.y - movY > -50)
                this.y -= movY;
            break;
        case "down":
            console.log("You pressed down");
            if (this.y + movY < 400)
                this.y += movY;
            break;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//global.drawScore = drawScore;
//global.drawLives = drawLives;
//global.drawLevel = drawLevel;

/**
* Draws the level text on the canvas.
*/
function drawLevel() {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Level - ' + player.level, 101 * 2.5, 45);
    ctx.restore();
}

/**
* Draws the hearts (indicating lives remaining) on the canvas.
*/
function drawLives() {
    var y = 40;
    for (var i = 0, len = player.lives; i < len; i++) {
      rightSideBarCtx.drawImage(Resources.get('images/Star.png'), 10, y, 25, 43);
      y += 30;
    }
}
/**
* Draws the score text on the canvas.
*/
function drawScore() {
    ctx.save();
    ctx.font = '24px serif';
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Score: ' + player.score, 101 * 5, 45);
    ctx.restore();
}

var leftSideBar = document.getElementById("left");

function drawSound() {
    leftSideBarCtx.clearRect(0, 0, leftSideBar.width, leftSideBar.height);
    if (soundOn)
        leftSideBarCtx.drawImage(Resources.get('images/sound-on.png'), 10, 10, 25, 43);
    else
        leftSideBarCtx.drawImage(Resources.get('images/sound-off.png'), 10, 10, 25, 43);
}

leftSideBar.addEventListener('click',function(loc) {
    var x = loc.clientX;
    var y = loc.clientY;

    if (y > 20 && y < 60)
    {
        if (soundOn===true)
        {
            soundOn=false;

            drawSound();
        }
        else if (soundOn===false)
        {
            soundOn=true;
            drawSound();
        }
    }

  console.log(x,y);
  //player.handleInputMouse(x,y);
});


/*
document.addEventListener('click',function(loc) {
  var x = loc.pageX;
  var y = loc.pageY;

  console.log(x,y);
  //player.handleInputMouse(x,y);
})
*/
