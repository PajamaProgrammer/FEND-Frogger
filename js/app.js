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

//Global Variables
var soundOn = true;
var newLife = false;
var highScore = 0;

//Controls Animation drawings
var animation = {
    suspend : false,
    bounce : {
        animate : false,
        isUp : false,
        isDown : false
    },
    die : {
        animate : false
    },
    win : {
        animage : false
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

// Audio Sounds for Game
var sounds = {
    bounce : {
        audio: new Audio('sounds/341708__projectsu012__bouncing-3.wav'),
        mediaElementSource: null
    },
    die : {
        audio: new Audio('sounds/319998__manuts__death-5.wav'),
        mediaElementSource: null
    },
    gameover : {
        audio: new Audio('sounds/76376__spazzo-1493__game-over.wav'),
        mediaElementSource: null
    },
    levelup : {
        audio: new Audio('sounds/320655__rhodesmas__level-up-01.wav'),
        mediaElementSource: null
    },
    newlife : {
        audio: new Audio('sounds/341695__projectsu012__coins-1.wav'),
        mediaElementSource: null
    },
    move : {
        audio: new Audio('sounds/194081__potentjello__woosh-noise-1.wav'),
        mediaElementSource: null
    }
};

var audioCtx;

//Initialize sounds if sound is supported
if (window.AudioContext) {
    audioCtx = new window.AudioContext();

    for (var i = 0; i < sounds.length; i++) {
        sounds[i].mediaElementSource = audioCtx.createMediaElementSource(sounds[i].audio);
    }
}

function playSound(sound) {
    if (soundOn === false)  //abort if player has muted sounds
        return;

    sound = sounds[sound];
    sound.audio.currentTime = 0.05;
    sound.audio.volume = 0.05;
    sound.audio.play();
}

var updateDifficulty = function() {
    var EnemyCap = 7;
    var RockCap = 3;
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
        (this.y > (player.y - 20)) && (this.y < (player.y + 20)) &&
        this.appear && animation.bounce.animate === false)
    {
        player.handleBounce();
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
        this.y = ROW[Math.floor(Math.random()*3) + 1];
        this.x = -100;
    }
    if ((this.x > (player.x - 45)) && (this.x < (player.x + 20)) &&
        (this.y > (player.y - 20)) && (this.y < (player.y + 20)) &&
        animation.suspend === false)
    {
        player.handleCollision();
    }
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
    this.reset();
    this.sprite = 'images/char-boy.png';
    //this.newGame();
    //newGame();
};

Player.prototype.update = function(dt) {
    if (this.y < -20 && animation.suspend === false)
    {
        playSound('levelup');
        animation.win.animate = true;
        animation.suspend = true;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.score += 100;
        gameState.score = this.score;
        this.level += 1;
        gameState.level = this.level;
        if ((this.level%25===0 || this.score%5000===0) && newLife === false)
        {
            playSound('newlife');
            newLife = true;
            this.lives++;
            gameState.lives = this.lives;
        }
        else if (newLife === true)
            newLife = false;

        //this.reset();
        updateDifficulty();
    }

    if (animation.bounce.animate === true)
    {
        if (animation.bounce.isUp === true)
            this.scale += 0.1;

        if (this.scale >= 1.5)
        {
            animation.bounce.isUp = false;
            animation.bounce.isDown = true;
        }

        if (animation.bounce.isDown === true)
            this.scale -= 0.1;

        if (this.scale <= 1)
        {
            animation.bounce.isDown = false;
            animation.bounce.animate = false;
            animation.suspend = false;
            this.scale = 1;
        }
    }

    if (animation.die.animate === true)
    {
        this.scale -= 0.1;

        if (this.scale < 0)
        {
            animation.suspend = false;
            animation.die.animate = false;
            this.reset();
        }
    }

    if (animation.win.animate === true)
    {
        this.scale -= 0.1;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        if (this.scale < 0)
        {
            animation.suspend = false;
            animation.win.animate = false;
            this.reset();
        }
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
        animation.suspend = true;
        animation.die.animate = true;
        playSound('die');
        this.lives -= 1;
        gameState.lives = this.lives;
    }
    else
        gameOver();
};

Player.prototype.handleBounce = function() {
    animation.suspend = true;
    animation.bounce.animate = true;
    animation.bounce.isUp = true;
    playSound('bounce');
    var dir;

    switch (this.dir)
    {
        case "up": //approach rock while going up
            this.row++;
            this.y = ROW[this.row];
            dir = Math.floor(Math.random()*3);
            if (dir === 1 && this.col < 4) //bounce right
            {
                this.col++;
                this.x = COL[this.col];
            }
            if (dir === 2 && this.col > 0) //bounce left
            {
                this.col--;
                this.x = COL[this.col];
            }

            break;

        case "left":
            this.col++;
            this.x = COL[this.col];
            dir = Math.floor(Math.random()*3);
            if (dir === 1) //bounce up
            {
                this.row--;
                this.y = ROW[this.row];
            }
            if (dir === 2) //bounce down
            {
                this.row++;
                this.y = ROW[this.row];
            }

            break;
        case "right":
            this.col--;
            this.x = COL[this.col];
            dir = Math.floor(Math.random()*3);
            if (dir === 1) //bounce up
            {
                this.row--;
                this.y = ROW[this.row];
            }
            if (dir === 2) //bounce down
            {
                this.row++;
                this.y = ROW[this.row];
            }
            break;

        case "down":
            this.row--;
            this.y = ROW[this.row];
            dir = Math.floor(Math.random()*3);
            if (dir === 1 && this.col < 4) //bounce right
            {
                this.col++;
                this.x = COL[this.col];
            }
            if (dir === 2 && this.col > 0) //bounce left
            {
                this.col--;
                this.x = COL[this.col];
            }
            break;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + (50 - 50*this.scale), this.y + (85 - 85*this.scale), 101*this.scale, 171*this.scale);
};

Player.prototype.handleInput = function(key) {
    console.log(key, this.x, this.y);
    var movX = canvasWidth/5;
    var movY = (canvasHeight - 100)/6;

    playSound('move');
    switch (key)
    {
        case "left":
            console.log("You pressed left", this.scale);
            if (this.x - movX > -5)
            {
                this.dir = "left";
                this.col--;
                this.x = COL[this.col];
            }
            break;
        case "right":
            console.log("You pressed right");
            if (this.x + movX < 410)
            {
                this.dir = "right";
                this.col++;
                this.x = COL[this.col];
            }
            break;
        case "up":
            console.log("You pressed up");
            if (this.y - movY > -50)
            {
                this.dir = "up";
                this.row--;
                this.y = ROW[this.row];
            }
            break;
        case "down":
            console.log("You pressed down");
            if (this.y + movY < 400)
            {
                this.dir = "down";
                this.row++;
                this.y = ROW[this.row];
            }
            break;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player;
var allEnemies, allRocks, allCollectibles;

function newGame () {
    player = new Player();
    allRocks = [];
    allCollectibles = [];
    allEnemies = [new Enemy(), new Enemy(), new Enemy()];
};

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

var gameOver = function() {
    playSound('gameover');
    //TODO: Show High Score...
    if (gameState.score > highScore)
    {
        highScore = gameState.score;
        console.log("New High Score: ", highScore);
    }
    //delete all Enemies and Rocks
    allEnemies.length = 0;
    allRocks.length = 0;

    gameState.lives = gameState.original.lives;
    gameState.level = gameState.original.level;
    gameState.score = gameState.original.score;
    gameState.numEnemies = gameState.original.numEnemies;
    gameState.newEnemyLevel = gameState.original.newEnemyLevel;
    gameState.enemySpeed = gameState.original.enemySpeed;
    gameState.numCollectables = gameState.original.numCollectables;
    gameState.numRocks = gameState.original.numRocks;
    gameState.newRockLevel = gameState.original.newRockLevel;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    newGame();
};
/*
document.addEventListener('click',function(loc) {
  var x = loc.pageX;
  var y = loc.pageY;

  console.log(x,y);
  //player.handleInputMouse(x,y);
})
*/
