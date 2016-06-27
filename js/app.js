/*
--------------------- Global Variables ---------------------
*/

//Global Variables - General
var soundOn = true;     //Mutes Sound effects if set to false

//Entities
var player, allEnemies, allRocks, allCollectibles, gameTimer;

//Canvas Size
var canvasWidth = 505;
var canvasHeight = 606;

//Rows and Columns
var ROW = [-25, 60, 145, 230, 315, 400];
var COL = [0, 100, 200, 300, 400];

//All possible sprites
var sprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

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
    newLifeScore: 5000,
    newLifeLevel: 25,
    maxTime: 301,
    highScore: false,       //General Settings that span entire session
    highScoreRecord: {
        scores: [],
        levels: []
    },
    playerSprite: sprites[0],
    original: {
      lives: 3,
      level: 1,
      score: 0,
      numEnemies: 3,
      newEnemyLevel: 15,
      enemySpeed: [25, 200],
      numCollectables: 3,
      numRocks: 0,
      newRockLevel: 5,
      newLifeScore: 5000,
      newLifeLevel: 25,
      maxTime: 301,
    }
};

//Controls Animations
var animation = {
    suspend : false,    //suspends all other animations
    bounce : {
        animate : false,
        isUp : false,
        isDown : false
    },
    die : {
        animate : false
    },
    win : {
        animage : false,
        isUp : false,
        isDown : false
    }
}

//All possible collectibles
var collect = {
    orange : 'images/Gem Orange.png',
    green : 'images/Gem Green.png',
    blue : 'images/Gem Blue.png',
    key : 'images/Key.png',
    heart : 'images/Heart.png'
};

// Audio Sounds for Game - all sounds were found on http://www.freesound.org/
var sounds = {
    bounce : {
        audio: new Audio('sounds/341708__projectsu012__bouncing-3.wav')
    },
    die : {
        audio: new Audio('sounds/319998__manuts__death-5.wav')
    },
    gameover : {
        audio: new Audio('sounds/76376__spazzo-1493__game-over.wav')
    },
    levelup : {
        audio: new Audio('sounds/320655__rhodesmas__level-up-01.wav')
    },
    newlife : {
        audio: new Audio('sounds/341695__projectsu012__coins-1.wav')
    },
    move : {
        audio: new Audio('sounds/194081__potentjello__woosh-noise-1.wav')
    },
    collect : {
        audio: new Audio('sounds/194439__high-festiva__gem-ping.wav')
    },
    timeup : {
        audio: new Audio('sounds/157218__adamweeden__video-game-die-or-lose-life.wav')
    },
    startmenu : {
        audio: new Audio('sounds/275673__foolboymedia__c64-melody.wav')
    },
    click : {
        audio: new Audio('sounds/342200__christopherderp__videogame-menu-button-click.wav')
    }
};

/*
--------------------- Function ---------------------
Plays the chosen sound - option is an optional parameter used to further control how the sound is played
*/
function playSound(sound, option) {

    sound = sounds[sound];          //set the sound

    //loop option will set the settings to loop the sound over and over...
    if (option === 'loop')
    {
        if (typeof sound.audio.loop == 'boolean')
            sound.audio.loop = true;
        else
        {
            //if loop isn't an option, then an event listener will be added to force a replay of the sound
            sound.audio.addEventListener('ended', function() {
            this.currentTime = 0.00;
            this.play();
            }, false);
        }
    }

    if (option === 'mute' || soundOn === false) //abort if player has muted sounds
    {
        sound.audio.pause();
        return;
    }

    if (option === 'resume')
    {
        sound.audio.play();
        return;
    }
    //Default action is to play the sound requested from the beginning
    sound.audio.currentTime = 0.00; //be kind, rewind
    sound.audio.volume = 0.05;      //set volume
    sound.audio.play();             //play
}

/*
--------------------- Function ---------------------
Updates the games difficulty with each level
*/
var updateLevel = function() {
    //Limits the number of in game spawns
    var EnemyCap = 7;
    var RockCap = 3;

    //Reached a high level, spawn new enemy
    if (gameState.level===gameState.newEnemyLevel && gameState.numEnemies < EnemyCap)
    {
        //console.log("new Enemy");
        gameState.numEnemies++;
        gameState.newEnemyLevel += gameState.newEnemyLevel*2;
        allEnemies.push(new Enemy());
    }

    //Update EnemySpeed range
    gameState.enemySpeed[0] += 1;
    gameState.enemySpeed[1] += 5;

    //Reached a high level, spawn new rock and a new collectible
    if (gameState.level===gameState.newRockLevel && gameState.numRocks < RockCap)
    {
        //console.log("new rock");
        gameState.numRocks++;
        gameState.newRockLevel += gameState.newRockLevel*2;
        allRocks.push(new Rock());

        gameState.numCollectables++;
        allCollectibles.push(new Collectible());
    }

    allRocks.forEach(function(rock) {
        rock.reset();
    });

    allCollectibles.forEach(function(Collectible) {
        Collectible.reset();
    });

    gameTimer.reset();
};

/*
--------------------- Function ---------------------
Generates a new game with default number of spawns for each entity
*/
function newGame () {
    player = new Player();
    allRocks = [];
    allCollectibles = [new Collectible(), new Collectible(), new Collectible()];
    allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    gameTimer = new Timer();
};
/*
--------------------- Function ---------------------
Updates the High Score Record (shows only highest 10 scores)
*/
function updateHighScore() {

    gameState.highScore = false;

    //First Game is always a High Score
    if (gameState.highScoreRecord.scores.length === 0)
    {
        gameState.highScore = 1;
        gameState.highScoreRecord.scores.push(gameState.score);
        gameState.highScoreRecord.levels.push(gameState.level);
        return;
    }

    //Insert new high score
    for (var i = 0; i<gameState.highScoreRecord.scores.length; i++)
    {
        console.log(gameState.highScoreRecord.scores[i]);
        if (gameState.score >= gameState.highScoreRecord.scores[i])
        {
            gameState.highScore = i+1;
            gameState.highScoreRecord.scores.splice(i, 0, gameState.score);
            gameState.highScoreRecord.levels.splice(i, 0, gameState.level);

            console.log(gameState.highScoreRecord.scores);

            if (gameState.highScoreRecord.scores.length > 10)
            {
                gameState.highScoreRecord.scores.pop();
                gameState.highScoreRecord.levels.pop();
                console.log(gameState.highScoreRecord.scores);
            }
            return;
        }
    }

    //if less than ten high scores, append to the end.
    if (gameState.highScoreRecord.scores.length < 10)
    {
        gameState.highScoreRecord.scores.splice(9, 0, gameState.score);
        gameState.highScoreRecord.levels.splice(9, 0, gameState.level);
        gameState.highScore = gameState.highScoreRecord.scores.length;
        console.log(gameState.highScoreRecord.scores);
        return;
    }
}

/*
--------------------- Function ---------------------
Game Over - resets the gameState
*/
var gameOver = function() {

    gameState.gameCount++;
    playSound('gameover');
    updateHighScore();

    //delete all Enemies and Rocks
    allEnemies.length = 0;
    allRocks.length = 0;
    allCollectibles.length = 0;

    //Reset GameState
    for (var state in gameState.original)
    {
        gameState[state] = gameState.original[state];
    }

    //Start the end menu
    menus.end.active = true;
};
/*
--------------------- Entity ---------------------
Collectibles may randomly appear as the game progresses
*/
var Collectible = function() {
    this.reset();
}
Collectible.prototype.reset = function() {
    this.appear = true;
    this.tick = 0;
    this.dir = 'left';

    this.y = ROW[Math.floor(Math.random()*3) + 1];
    this.x = COL[Math.floor(Math.random()*5)]

    var gem = Math.floor(Math.random()*125);

    if (gem > 92)
    {
        this.appear = false;
        this.type = 'none';
    }
    else if (gem === 92)
    {
        this.sprite = collect['heart']
        this.type = 'heart';
    }
    else if (gem === 91)
    {
        this.sprite = collect['key']
        this.type = 'key';
    }
    else if (gem <= 30)
    {
        this.sprite = collect['orange'];
        this.type = 'gem';
    }
    else if (gem <=60)
    {
        this.sprite = collect['green'];
        this.type = 'gem';
    }
    else
    {
        this.sprite = collect['blue'];
        this.type = 'gem';
    }

    //console.log(gem, this.sprite, this.x, this.y, this.appear);
}

Collectible.prototype.render = function() {
    if (this.appear)
    {
        ctx.drawImage(Resources.get(this.sprite), this.x + (65 - 50*.25), this.y + (115 - 85*.25), 25, 43);
    }
}

Collectible.prototype.update = function(dt) {

    if ((this.x > (player.x - 35)) && (this.x < (player.x + 35)) &&
        (this.y > (player.y - 35)) && (this.y < (player.y + 35)) &&
        this.appear)
    {
        this.appear = false;
        player.handleCollectible(this.type);
    }

    this.tick++;
    switch (this.dir)
    {
        case 'left':
            this.x--;
            if (this.tick > 25)
            {
                this.tick = 0;
                this.dir = 'up';
            }
            break;
        case 'up':
            this.y--;
            if (this.tick > 25)
            {
                this.tick = 0;
                this.dir = 'right';
            }
            break;
        case 'right':
            this.x++;
            if (this.tick > 25)
            {
                this.tick = 0;
                this.dir = 'down';
            }
            break;
        case 'down':
            this.y++;
            if (this.tick > 25)
            {
                this.tick = 0;
                this.dir = 'left';
            }
            break;
    }

};
/*
--------------------- Entity ---------------------
Rocks are obstacles that the player must move around. Even after they are spawned, they do not always appear.
*/

//Spawn a Rock
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.reset();
}

//Reset a Rock, reset in this context will assign a new location and determine if the rock appears to player
Rock.prototype.reset = function() {
    this.appear = Math.floor(Math.random()*2) === 0 ? true : false;
    this.y = ROW[Math.floor(Math.random()*2) + 2]; //Can only appear on lower 2 roads
    this.x = COL[Math.floor(Math.random()*5)];
};

//Draw the rock, but only if it actually appears.
Rock.prototype.render = function() {
    if (this.appear)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Rocks don't move, but they will detect if a player has bounced off of them.
Rock.prototype.update = function(dt) {
    if ((this.x > (player.x - 20)) && (this.x < (player.x + 20)) &&
        (this.y > (player.y - 20)) && (this.y < (player.y + 20)) &&
        this.appear && animation.bounce.animate === false)
    {
        player.handleBounce();
    }
}

/*
--------------------- Entity ---------------------
Enemies our player must avoid
*/

//Spawn an Enemy
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

//Reset in this context means to move the enemy back off the screen and assign a new speed and row
Enemy.prototype.reset = function() {
    this.speed = this.randomSpeed();                //Assign a random speed to the enemy
    this.y = ROW[Math.floor(Math.random()*3) + 1];  //Assign a random row to the enemy
    this.x = -100;  //All enemies start off the canvas
};

//Assign enemy a random speed.
Enemy.prototype.randomSpeed = function () {
    return Math.floor(Math.random() * (gameState.enemySpeed[1] - gameState.enemySpeed[0] + 1)) + gameState.enemySpeed[0];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;    //Move the enemy

    //Reset enemy once it has reached the other side
    if (this.x > canvasWidth)
        this.reset();

    //Detect if player has crashed into enemy
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

/*
--------------------- Entity ---------------------
The Player
*/

//Spawn the Player
var Player = function() {
    //Set score, lives, level to game defaults
    this.score = gameState.original.score;
    this.lives = gameState.original.lives;
    this.level = gameState.original.level;
    this.reset();
    this.sprite = gameState.playerSprite;
};

//Reset in this context will move player back to starting position
Player.prototype.reset = function() {
    this.col = 2;
    this.row = 4;
    this.x = COL[this.col];
    this.y = ROW[this.row];
    this.scale = 1;
};

//Update player movements
Player.prototype.update = function(dt) {

    //Reached high score, player recieves a new life
    if (this.score>=gameState.newLifeScore)
    {
        playSound('newlife');
        console.log("new life");
        player.lives++;
        player.score+=250;
        gameState.newLifeScore += 5000;

        gameState.score = this.score;
        gameState.lives = this.lives;
        gameState.level = this.level;
    }

    //Reached the water, Level up
    if (this.y < -20 && animation.suspend === false)
    {
        animation.suspend = true;       //Suspends other interactions
        animation.win.animate = true;   //set win animation in motion
        animation.win.isUp = true;

        this.score += 100;
        this.level += 1;

        //Reached high level, player recieves a new life
        if (this.level>=gameState.newLifeLevel)
        {
            playSound('newlife');
            console.log("new life");
            player.lives++;
            player.score+=250;
            gameState.newLifeLevel += 25;
        }
        else
            playSound('levelup');

        gameState.score = this.score;
        gameState.lives = this.lives;
        gameState.level = this.level;

        //Each new level will update the difficulty just a little bit
        updateLevel();
    }

//------------------------------- Animation Contol
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

        if (animation.win.isUp === true)
        {
            this.scale += 0.1;
        }

        if (this.scale >= 1.5)
        {
            animation.win.isUp = false;
            animation.win.isDown = true;
        }

        if (animation.win.isDown)
            this.scale -= 0.1;

        if (this.scale < 0)
        {
            animation.suspend = false;
            animation.win.animate = false;
            animation.win.isDown = false;
            this.reset();
        }
    }
};

//Times up for the player
Player.prototype.handleTimesUp = function() {
    if (this.lives > 0)
    {
        animation.suspend = true;       //suspend other interactions
        animation.die.animate = true;   //trigger die animations
        playSound('timeup');
        this.lives -= 1;
        gameState.lives = this.lives;
    }
    else
        gameOver();
}

//Player has crashed into an Enemy
Player.prototype.handleCollision = function() {

    if (this.lives > 0)
    {
        animation.suspend = true;       //suspend other interactions
        animation.die.animate = true;   //trigger die animations
        playSound('die');
        this.lives -= 1;
        gameState.lives = this.lives;
    }
    else
        gameOver();
};

//Player has picked up a collectible
Player.prototype.handleCollectible = function(type) {

    //clear canvas in order to update score/level
    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    switch (type)
    {
        case 'gem':
            playSound('collect');
            this.score += 50;
            break;
        case 'heart':
            playSound('newlife');
            this.score += 500;
            this.lives++;
            break;
        case 'key':
            playSound('levelup');
            this.score += 500;
            this.level++;
            animation.suspend = true;       //Suspends other interactions
            animation.win.animate = true;   //set win animation in motion
            animation.win.isUp = true;
            updateLevel();
            break;
    }

    gameState.score = this.score;
    gameState.level = this.level;
    gameState.lives = this.lives;
};

//Player has bounced off a rock
Player.prototype.handleBounce = function() {
    animation.suspend = true;
    animation.bounce.animate = true;
    animation.bounce.isUp = true;
    playSound('bounce');

    //var dir;

    //Will determine the direction that the player will bounce off the rock
    //Originally coded with some randomness, but the random direction has been commented out
    //since it might be confusing to players...
    switch (this.dir)
    {
        case "up": //approached rock while going up
            this.row++;
            this.y = ROW[this.row];
            /*
            dir = Math.floor(Math.random()*3);
            if (dir === 1 && this.col < 4) // 1/3 chance to also bounce right
            {
                this.col++;
                this.x = COL[this.col];
            }
            if (dir === 2 && this.col > 0) // 1/3 chance to also bounce left
            {
                this.col--;
                this.x = COL[this.col];
            }
            */
            break;
        case "left":
            this.col++;
            this.x = COL[this.col];
            /*
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
            */
            break;
        case "right":
            this.col--;
            this.x = COL[this.col];
            /*
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
            */
            break;
        case "down":
            this.row--;
            this.y = ROW[this.row];
            /*
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
            */
            break;
    }
};

//Draw the player - the player scales up or down depending on animation settings
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x + (50 - 50*this.scale), this.y + (85 - 85*this.scale), 101*this.scale, 171*this.scale);
    ctx.drawImage(Resources.get('images/Green Road Sign_Tansparent.png'), COL[2]-34, 440, 175, 175);

};

//Keyboard input is used to determing player movements
Player.prototype.handleInput = function(key) {
    //console.log(key, this.x, this.y);
    var movX = canvasWidth/5;
    var movY = (canvasHeight - 100)/6;

    playSound('move');
    switch (key)
    {
        case "left":
            //console.log("You pressed left");
            if (this.x - movX > -5)
            {
                this.dir = "left";
                this.col--;
                this.x = COL[this.col];
            }
            break;
        case "right":
            //console.log("You pressed right");
            if (this.x + movX < 410)
            {
                this.dir = "right";
                this.col++;
                this.x = COL[this.col];
            }
            break;
        case "up":
            //console.log("You pressed up");
            if (this.y - movY > -50)
            {
                this.dir = "up";
                this.row--;
                this.y = ROW[this.row];
            }
            break;
        case "down":
            //console.log("You pressed down");
            if (this.y + movY < 400)
            {
                this.dir = "down";
                this.row++;
                this.y = ROW[this.row];
            }
            break;
    }
    console.log(this.x, this.y);
};


var Timer = function(){
    this.reset();
};

Timer.prototype.reset = function() {
    this.now = Date.now();
    this.maxTime = gameState.maxTime;
    this.min = Math.floor(this.maxTime/60);
    this.sec = Math.floor(this.maxTime%60);
    this.color = 'black';
    //console.log(this.min, this.sec, this.now);
}

Timer.prototype.update = function() {

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.last = this.now;
    this.now = Date.now();
    this.dt = (this.now - this.last)/1000;
    this.maxTime -= this.dt;
    this.min = Math.floor(this.maxTime/60);
    this.sec = Math.floor(this.maxTime%60);

    if (this.maxTime < 60)
    {
        this.color = 'red';
    }
    if (this.maxTime < 0)
    {
        console.log("times up");
        player.handleTimesUp();
        this.reset();
    }
}

Timer.prototype.render = function() {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = this.color;
    ctx.fillText('Timer ' + this, 2.5, 45);
    ctx.restore();
}

Timer.prototype.toString = function() {
    var time = this.min + ':';

    if (this.sec < 10)
        time += '0' + this.sec;
    else
        time += this.sec;

    return time;
}

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


/*
--------------------- Canvas - Additional information ---------------------
*/
/*
//Draws the timer text on the canvas - top left
function drawTimer() {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Timer ' + gameTimer, 2.5, 45);
    ctx.restore();
}
*/
//Draws the level text on the canvas - top middle
function drawLevel() {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'black';
    ctx.fillText('Level - ' + player.level, 101 * 2.5, 45);
    ctx.restore();
}

//Draws the score text on the canvas - top right
function drawScore() {
    ctx.save();
    ctx.font = '24px serif';
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + player.score, 101 * 5, 45);
    ctx.restore();
}

//Draws the stars (indicating lives remaining) on the canvas - on right side bar
var rightSideBar = document.getElementById("right");    //grab the right side bar

function drawLives() {
    rightSideBarCtx.clearRect(0, 0, rightSideBar.width, rightSideBar.height);
    var y = 40;
    for (var i = 0, len = player.lives; i < len; i++) {
      rightSideBarCtx.drawImage(Resources.get('images/Star.png'), 10, y, 25, 43);
      y += 30;
    }
}

//Draws the sound icon to indicate whether sounds are muted or not - sounds can be muted by clicking the icon
var leftSideBar = document.getElementById("left");      //grab left side bar

function drawSoundBar() {
    leftSideBarCtx.clearRect(0, 0, leftSideBar.width, leftSideBar.height);
    if (soundOn)
        leftSideBarCtx.drawImage(Resources.get('images/sound-on.png'), 3, 3, 45, 45);
    else
        leftSideBarCtx.drawImage(Resources.get('images/sound-off.png'), 3, 3, 45, 45);
}

//Add mouse click listener to left side bar
leftSideBar.addEventListener('click',function(e) {
    var rect = leftSideBar.getBoundingClientRect();

    //Mouse position reletive to side bar
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    //Toggle sound if player clicks the icon
    if (y > 3 && y < 47 && x > 3 && x < 47)
    {
        if (soundOn===true)
        {
            soundOn=false;
            menus.sound = 'mute';     //toggle end/start menu sound
            drawSoundBar();
        }
        else if (soundOn===false)
        {
            soundOn=true;
            menus.sound = 'resume';       //toggle end/start menu sound
            drawSoundBar();
        }
    }
});

leftSideBar.addEventListener('mousemove',function(e) {
    var rect = leftSideBar.getBoundingClientRect();
    //Mouse position reletive to left side bar
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    document.body.style.cursor = "default";
    //Change cursor if mouse is over icon
    if (y > 3 && y < 47 && x > 3 && x < 47)
        document.body.style.cursor = "pointer";
});

/*
document.addEventListener('click',function(loc) {
  var x = loc.pageX;
  var y = loc.pageY;

  console.log(x,y);
  //player.handleInputMouse(x,y);
});
*/

