// Track the game state.
var gameState = {
    lives: 3,
    level: 1,
    score: 0,
    numEnemies: 3,
    newEnemyLevel: 15,
    enemySpeed: [25, 200],
    numCollectables: 3,
    numRocks: 0,
    newRockLevel: 5,
    original: {
      lives: 3,
      level: 1,
      score: 0,
      numEnemies: 3,
      newEnemyLevel: 15,
      enemySpeed: [25, 200],
      numCollectables: 3,
      numRocks: 0,
      newRockLevel: 5
    }
};

var soundOn = true;
var newLife = false;
var isBounce = false;

var animate = {
    bounce : {
        isBounceUp : false,
        isBounceDown : false
    }
}

//Canvas Size
var canvasWidth = 505;
var canvasHeight = 606;

//Player Offsets
var offsetX = (canvasWidth/5)/2;
var offsetY = (canvasHeight/6)/2;

//Rows and Columns
var ROW = [-25, 60, 145, 230, 315, 400];
var COL = [0, 100, 200, 300, 400];

var updateDifficulty = function() {
    var EnemyCap = 7;
    var RockCap = 3;
    console.log(Math.floor(Math.random()*2) === 0 ? true : false);
    if (gameState.level===gameState.newEnemyLevel && gameState.numEnemies < EnemyCap)    //Reached a high level, spawn new enemy
    {
        console.log("new Enemy");
        gameState.numEnemies++;
        gameState.newEnemyLevel += gameState.newEnemyLevel*2;
        allEnemies.push(new Enemy());
    }

    //Update EnemySpeed range
    gameState.enemySpeed[0] += 1;
    gameState.enemySpeed[1] += 5;
    console.log(gameState.enemySpeed[0], gameState.enemySpeed[1]);

    if (gameState.level===gameState.newRockLevel && gameState.numRocks < RockCap)    //Reached a high level, spawn new rock
    {
        console.log("new rock");
        gameState.numRocks++;
        gameState.newRockLevel += gameState.newRockLevel*2;
        allRocks.push(new Rock());
    }

    allRocks.forEach(function(rock) {
        rock.reset();
    });

}
// Rocks are obstacles that the player must move around
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.appear = Math.floor(Math.random()*2) === 0 ? true : false;
    this.y = ROW[Math.floor(Math.random()*2) + 2]; //Can only appear on lower 2 roads
    this.x = COL[Math.floor(Math.random()*5)];
}

Rock.prototype.reset = function() {
    this.appear = Math.floor(Math.random()*2) === 0 ? true : false;
    this.y = ROW[Math.floor(Math.random()*2) + 2]; //Can only appear on lower 2 roads
    this.x = COL[Math.floor(Math.random()*5)];
};

Rock.prototype.render = function() {
    if (this.appear)
    {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Rock.prototype.update = function(dt) {
    if ((this.x > (player.x - 20)) && (this.x < (player.x + 20)) &&
        (this.y > (player.y - 20)) && (this.y < (player.y + 20)) && this.appear)
    {
        player.handleBounce(dt);
    }
}

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';

    this.speed = this.randomSpeed();
    //console.log(this.speed);
    this.y = ROW[Math.floor(Math.random()*3) + 1];
    this.x = -100;
};

Enemy.prototype.randomSpeed = function () {
    return Math.floor(Math.random() * (gameState.enemySpeed[1] - gameState.enemySpeed[0] + 1)) + gameState.enemySpeed[0];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
    if (this.x > canvasWidth)
    {
        this.speed = this.randomSpeed();
        //console.log(this.speed);
        this.y = ROW[Math.floor(Math.random()*3) + 1];
        this.x = -100;
    }
    //console.log(player.x, this.x);
    if ((this.x > (player.x - 45)) && (this.x < (player.x + 20)) &&
        (this.y > (player.y - 20)) && (this.y < (player.y + 20)))
    {
        player.handleCollision();
        console.log("you've crashed");
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
    this.score = gameState.original.score;
    this.lives = gameState.original.lives;
    this.level = gameState.original.level;
    this.col = 2;
    this.row = 4;
    this.x = COL[this.col];
    this.y = ROW[this.row];
    this.sprite = 'images/char-boy.png';
    this.scale = 1;
    //this.newGame();
    //this.reset();
};

Player.prototype.update = function(dt) {
    if (this.y < -20)
    {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.score += 100;
        gameState.score = this.score;
        this.level += 1;
        gameState.level = this.level;
        if ((this.level%25===0 || this.score%5000===0) && newLife === false)
        {
            newLife = true;
            this.lives++;
            gameState.lives = this.lives;
        }
        else if (newLife === true)
            newLife = false;

        this.reset();
        updateDifficulty();
    }
};

Player.prototype.reset = function() {
    this.col = 2;
    this.row = 4;
    this.x = COL[this.col];
    this.y = ROW[this.row];
    this.scale = 1;
};

Player.prototype.handleCollision = function() {
    if (this.lives > 0)
    {
        this.lives -= 1;
        gameState.lives = this.lives;
    }
    this.reset();
};

Player.prototype.handleBounce = function(dt) {
    var dir = Math.floor(Math.random()*8); //eight possible directions to bounce in
    if (this.scale < 1.5)
        this.scale += 1.1*dt;
    console.log("BOING!", this.scale);
    switch (dir)
    {
        case 0: //bounce down

            break;
        case 1:
        break;
        default:

    }
    //this.reset();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101*this.scale, 171*this.scale);
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
            {
                this.col--;
                this.x = COL[this.col];
            }
            break;
        case "right":
            console.log("You pressed right");
            if (this.x + movX < 410)
            {
                this.col++;
                this.x = COL[this.col];
            }
            break;
        case "up":
            console.log("You pressed up");
            if (this.y - movY > -50)
            {
                this.row--;
                this.y = ROW[this.row];
            }
            break;
        case "down":
            console.log("You pressed down");
            if (this.y + movY < 400)
            {
                this.row++;
                this.y = ROW[this.row];
            }
            break;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
var allRocks = [];



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
* Draws the stars (indicating lives remaining) on the canvas.
*/
var rightSideBar = document.getElementById("right");

function drawLives() {
    rightSideBarCtx.clearRect(0, 0, rightSideBar.width, rightSideBar.height);
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
