/*
 * Udacity: Front-End Web Deverloper Program
 * Author: Pajama Programmer
 * Date 29-Jun-2016
 *
 * Description:
 * In a world overrun by killer bugs, your only escape is by boat. Look to the wooden sign and choose
 * your escape wisely! Beat the timer, navigate the playing field, avoid the killer bugs, watch out for
 * rocks, and pickup collectibles.
 *
 * App.js - This file pretty much does it all... Holds most of the logic for handling player/enemy movement in game
 */
/*
--------------------- Global Variables ---------------------
*/
//Global Variables - General
var soundOn = true; //Mutes Sound effects if set to false

//Entities
var player, allEnemies, allRocks, allCollectibles, gameTimer, mathSign, mathBoats;

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
    newEnemyLevel: 25,
    enemySpeed: [25, 200],
    numCollectables: 3,
    numRocks: 0,
    newRockLevel: 10,
    newLifeScore: 5000,
    newLifeLevel: 25,
    maxTime: 301,
    highScore: false, //General Settings that span entire session
    highScoreRecord: {
        scores: [],
        levels: [],
        modes: []
    },
    playerSprite: sprites[0],
    original: { //used for resetting the game state
        lives: 3,
        level: 1,
        score: 0,
        numEnemies: 3,
        newEnemyLevel: 25,
        enemySpeed: [25, 200],
        numCollectables: 3,
        numRocks: 0,
        newRockLevel: 10,
        newLifeScore: 5000,
        newLifeLevel: 25,
        maxTime: 301,
    }
};

//Controls Animations
var animation = {
    suspend: false, //suspends all other animations
    bounce: {
        animate: false,
        isUp: false,
        isDown: false
    },
    die: {
        animate: false
    },
    win: {
        animage: false,
        isUp: false,
        isDown: false
    }
};

//All possible collectibles
var collect = {
    orange: 'images/Gem Orange.png',
    green: 'images/Gem Green.png',
    blue: 'images/Gem Blue.png',
    key: 'images/Key.png',
    heart: 'images/Heart.png'
};

// Audio Sounds for Game - all sounds were found on http://www.freesound.org/
var sounds = {
    bounce: {
        audio: new Audio('sounds/341708__projectsu012__bouncing-3.wav')
    },
    die: {
        audio: new Audio('sounds/319998__manuts__death-5.wav')
    },
    gameover: {
        audio: new Audio('sounds/76376__spazzo-1493__game-over.wav')
    },
    levelup: {
        audio: new Audio('sounds/320655__rhodesmas__level-up-01.wav')
    },
    newlife: {
        audio: new Audio('sounds/341695__projectsu012__coins-1.wav')
    },
    move: {
        audio: new Audio('sounds/194081__potentjello__woosh-noise-1.wav')
    },
    collect: {
        audio: new Audio('sounds/194439__high-festiva__gem-ping.wav')
    },
    timeup: {
        audio: new Audio('sounds/157218__adamweeden__video-game-die-or-lose-life.wav')
    },
    startmenu: {
        audio: new Audio('sounds/275673__foolboymedia__c64-melody.wav')
    },
    click: {
        audio: new Audio('sounds/342200__christopherderp__videogame-menu-button-click.wav')
    },
    arrow: {
        audio: new Audio('sounds/166186__drminky__menu-screen-mouse-over.wav')
    },
    wrong: {
        audio: new Audio('sounds/131657__bertrof__game-sound-wrong.wav')
    },
    cheer: {
        audio: new Audio('sounds/165492__chripei__victory-cry-reverb-1.wav')
    }
};

/*
--------------------- Function ---------------------
Plays the chosen sound - option is an optional parameter used to further control how the sound is played
*/
function playSound(sound, option) {

    sound = sounds[sound]; //set the sound

    //loop option will set the settings to loop the sound over and over...
    if (option === 'loop') {
        if (typeof sound.audio.loop == 'boolean')
            sound.audio.loop = true;
        else {
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

    if (option === 'resume') {
        sound.audio.play();
        return;
    }
    //Default action is to play the sound requested from the beginning
    sound.audio.currentTime = 0.00; //be kind, rewind
    sound.audio.volume = 0.05; //set volume
    sound.audio.play(); //play
}

/*
--------------------- Function ---------------------
Updates the games difficulty with each level
*/
var updateLevel = function() {
    //Limits the number of in game spawns
    var EnemyCap = 8;
    var RockCap = 3; //do not increase! Game starts with 1, and 5 can block player from moving

    //Reached a high level, spawn new enemy
    if (gameState.level === gameState.newEnemyLevel && gameState.numEnemies < EnemyCap) {
        //console.log("new Enemy");
        gameState.numEnemies++;
        gameState.newEnemyLevel += gameState.newEnemyLevel * 2;
        allEnemies.push(new Enemy());
    }

    //Update EnemySpeed range
    gameState.enemySpeed[0] += 1;
    gameState.enemySpeed[1] += 2;

    //Reached a high level, spawn new rock and a new collectible
    if (gameState.level === gameState.newRockLevel && gameState.numRocks < RockCap) {
        //console.log("new rock");
        gameState.numRocks++;
        gameState.newRockLevel += gameState.newRockLevel * 2;
        allRocks.push(new Rock());

        gameState.numCollectables++;
        allCollectibles.push(new Collectible());
    }

    //Reset All rocks and collectibles
    allRocks.forEach(function(rock) {
        rock.reset();
    });

    allCollectibles.forEach(function(Collectible) {
        Collectible.reset();
    });

    //Reset timer
    gameTimer.reset();

    //Update math settings and then reset
    mathSign.updateLevel();
    mathSign.reset();
};

/*
--------------------- Function ---------------------
Generates a new game with default number of spawns for each entity
*/
function newGame() {

    //Set mathSettings to player specified settings
    setMathSettings();

    //Spawn players, rocks, collectibles, etc
    player = new Player();
    allRocks = [new Rock()]; //Game begins with one rock
    allCollectibles = [new Collectible(), new Collectible(), new Collectible()]; //game begins with three collectibles
    allEnemies = [new Enemy(), new Enemy(), new Enemy()]; //game begins with three killer bugs
    gameTimer = new Timer(); //start the timer
    mathBoats = []; //math boats are spawned by mathGenerator()
    mathSign = new mathGenerator(); //spawn mathGenerator
}

//http://stackoverflow.com/questions/2332811/capitalize-words-in-string/7592235#7592235
String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) {
        return a.toUpperCase();
    });
};
/*
--------------------- Function ---------------------
Updates the High Score Record (shows only highest 10 scores)
*/
function updateHighScore() {

    gameState.highScore = false;

    var mode = mathSettings.mathMode.capitalize() + " ( " + mathSettings.mode.capitalize() + " )";

    /*
    //First Game is always a High Score
    if (gameState.highScoreRecord.scores.length === 0) {
        gameState.highScore = 1;
        gameState.highScoreRecord.scores.push(gameState.score);
        gameState.highScoreRecord.levels.push(gameState.level);
        gameState.highScoreRecord.modes.push(mode);
        return;
    }
    */

    //Insert new high score
    for (var i = 0; i < gameState.highScoreRecord.scores.length; i++) {
        //console.log(gameState.highScoreRecord.scores[i]);
        if (gameState.score >= gameState.highScoreRecord.scores[i]) {
            gameState.highScore = i + 1;
            gameState.highScoreRecord.scores.splice(i, 0, gameState.score);
            gameState.highScoreRecord.levels.splice(i, 0, gameState.level);
            gameState.highScoreRecord.modes.splice(i, 0, mode);

            //console.log(gameState.highScoreRecord.scores);

            if (gameState.highScoreRecord.scores.length > 10) {
                gameState.highScoreRecord.scores.pop();
                gameState.highScoreRecord.levels.pop();
                gameState.highScoreRecord.modes.pop();
                //console.log(gameState.highScoreRecord.scores);
            }
            return;
        }
    }

    //if less than ten high scores, append to the end.
    if (gameState.highScoreRecord.scores.length < 10) {
        gameState.highScoreRecord.scores.splice(9, 0, gameState.score);
        gameState.highScoreRecord.levels.splice(9, 0, gameState.level);
        gameState.highScoreRecord.modes.splice(9, 0, mode);
        gameState.highScore = gameState.highScoreRecord.scores.length;
        //console.log(gameState.highScoreRecord.scores);
        return;
    }
}

/*
--------------------- Function ---------------------
Game Over - resets the gameState
*/
var gameOver = function() {

    playSound('gameover');
    updateHighScore();

    //delete all Enemies and Rocks
    allEnemies.length = 0;
    allRocks.length = 0;
    allCollectibles.length = 0;
    mathBoats.length = 0;

    //Reset GameState
    for (var state in gameState.original)
        gameState[state] = gameState.original[state];

    //Start the end menu
    menus.end.active = true;
};

/*
--------------------- Entity ---------------------
Collectibles may randomly appear as the game progresses
*/
var Collectible = function() {
    this.reset();
};

Collectible.prototype.reset = function() {
    this.appear = true;
    this.tick = 0;
    this.dir = 'left';

    //Assign a random location
    this.y = ROW[Math.floor(Math.random() * 4) + 1];
    this.x = COL[Math.floor(Math.random() * 5)];

    //Random statistic on gem type and whether it actually appears
    var gem = Math.floor(Math.random() * 125);

    if (gem <= 30) {
        this.sprite = collect['orange'];
        this.type = 'gem';
    } else if (gem <= 60) {
        this.sprite = collect['green'];
        this.type = 'gem';
    } else if (gem <= 90) {
        this.sprite = collect['blue'];
        this.type = 'gem';
    } else if (gem === 91) {
        this.sprite = collect['key'];
        this.type = 'key';
    } else if (gem === 92) {
        this.sprite = collect['heart'];
        this.type = 'heart';
    } else {
        this.appear = false;
        this.type = 'none';
    }

    //console.log(gem, this.sprite, this.x, this.y, this.appear);
};

//Draw collectible if it appears
Collectible.prototype.render = function() {
    if (this.appear) {
        ctx.drawImage(Resources.get(this.sprite), this.x + (65 - 50 * 0.25), this.y + (115 - 85 * 0.25), 25, 43);
    }
};

//Update controls the gem animation and detects if it has been picked up by player
Collectible.prototype.update = function(dt) {

    //Picked up by player
    if ((this.x > (player.x - 35)) && (this.x < (player.x + 35)) &&
        (this.y > (player.y - 35)) && (this.y < (player.y + 35)) &&
        this.appear) {
        this.appear = false;
        player.handleCollectible(this.type);
    }

    //Animation control
    this.tick++;
    switch (this.dir) {
        case 'left':
            this.x--;
            if (this.tick > 25) {
                this.tick = 0;
                this.dir = 'up';
            }
            break;
        case 'up':
            this.y--;
            if (this.tick > 25) {
                this.tick = 0;
                this.dir = 'right';
            }
            break;
        case 'right':
            this.x++;
            if (this.tick > 25) {
                this.tick = 0;
                this.dir = 'down';
            }
            break;
        case 'down':
            this.y++;
            if (this.tick > 25) {
                this.tick = 0;
                this.dir = 'left';
            }
            break;
    }

};
/*
--------------------- Entity ---------------------
Rocks are obstacles that block the way. Even after they are spawned, they do not always appear.
*/

//Spawn a Rock
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.reset();
};

//Reset a Rock, reset in this context will assign a new location and determine if the rock appears to player
Rock.prototype.reset = function() {
    this.appear = Math.floor(Math.random() * 2) === 0 ? true : false;
    this.y = ROW[Math.floor(Math.random() * 3) + 2]; //Can only appear on lower 3 roads
    this.x = COL[Math.floor(Math.random() * 5)];
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
        this.appear && animation.bounce.animate === false) {
        player.handleBounce();
    }
};

/*
--------------------- Entity ---------------------
Enemies, killer buys our player must avoid
*/

//Spawn an Enemy
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

//Reset in this context means to move the enemy back off the screen and assign a new speed and row
Enemy.prototype.reset = function() {
    this.speed = this.randomSpeed(); //Assign a random speed to the enemy
    this.y = ROW[Math.floor(Math.random() * 4) + 1]; //Assign a random row to the enemy
    this.x = -100; //All enemies start off the canvas
};

//Assign enemy a random speed.
Enemy.prototype.randomSpeed = function() {
    return Math.floor(Math.random() * (gameState.enemySpeed[1] - gameState.enemySpeed[0] + 1)) + gameState.enemySpeed[0];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt; //Move the enemy

    //Reset enemy once it has reached the other side
    if (this.x > canvasWidth)
        this.reset();

    //Detect if player has crashed into enemy
    if ((this.x > (player.x - 45)) && (this.x < (player.x + 20)) &&
        (this.y > (player.y - 20)) && (this.y < (player.y + 20)) &&
        animation.suspend === false) {
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
    this.col = 3;
    this.row = 5;
    this.x = COL[this.col];
    this.y = ROW[this.row];
    this.scale = 1;
};

//Update player movements
Player.prototype.update = function(dt) {

    //Reached high score, player recieves a new life
    if (this.score >= gameState.newLifeScore) {
        playSound('newlife');
        //console.log("new life");
        player.lives++;
        player.score += 250;
        gameState.newLifeScore += 5000;

        gameState.score = this.score;
        gameState.lives = this.lives;
        gameState.level = this.level;
    }

    //Reached the water, Level up
    /*
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
    */

    //------------------------------- Animation Contol
    if (animation.bounce.animate === true) {
        if (animation.bounce.isUp === true)
            this.scale += 0.1;

        if (this.scale >= 1.5) {
            animation.bounce.isUp = false;
            animation.bounce.isDown = true;
        }

        if (animation.bounce.isDown === true)
            this.scale -= 0.1;

        if (this.scale <= 1) {
            animation.bounce.isDown = false;
            animation.bounce.animate = false;
            animation.suspend = false;
            this.scale = 1;
        }
    }

    if (animation.die.animate === true) {
        this.scale -= 0.1;

        if (this.scale < 0) {
            animation.suspend = false;
            animation.die.animate = false;
            this.reset();
        }
    }

    if (animation.win.animate === true) {

        if (animation.win.isUp === true) {
            this.scale += 0.1;
        }

        if (this.scale >= 1.5) {
            animation.win.isUp = false;
            animation.win.isDown = true;
        }

        if (animation.win.isDown)
            this.scale -= 0.1;

        if (this.scale < 0) {
            animation.suspend = false;
            animation.win.animate = false;
            animation.win.isDown = false;
            this.reset();
        }
    }
};

//Times up for the player
Player.prototype.handleTimesUp = function() {
    if (this.lives > 0) {
        animation.suspend = true; //suspend other interactions
        animation.die.animate = true; //trigger die animations
        playSound('timeup');
        this.lives -= 1;
        gameState.lives = this.lives;
    } else
        gameOver();
};

//Player has crashed into an Enemy
Player.prototype.handleCollision = function() {

    if (this.lives > 0) {
        animation.suspend = true; //suspend other interactions
        animation.die.animate = true; //trigger die animations
        playSound('die');
        this.lives -= 1;
        gameState.lives = this.lives;
    } else
        gameOver();
};

//Player has picked up a collectible
Player.prototype.handleCollectible = function(type) {

    switch (type) {
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
            animation.suspend = true; //Suspends other interactions
            animation.win.animate = true; //set win animation in motion
            animation.win.isUp = true;
            updateLevel();
            break;
    }

    gameState.score = this.score;
    gameState.level = this.level;
    gameState.lives = this.lives;
};

//Player has landed on boat
Player.prototype.handleBoat = function(boatType) {

    animation.suspend = true; //Suspends other interactions

    //Player landed on wrong boat!
    if (boatType === false) {
        animation.bounce.animate = true;
        animation.bounce.isUp = true;
        playSound('wrong');
        this.reset();
        return;
    }

    animation.win.animate = true; //set win animation in motion
    animation.win.isUp = true;
    this.level += 1;

    if (boatType === 'HappyPirate') {
        //console.log("Happy Pirate");
        this.score += Math.floor(Math.random() * 201); //pirate booty is random
        playSound('cheer');
    }
    if (boatType === true) {
        this.score += 100;
        playSound('levelup');
    }

    //Reached high level, player also recieves a new life
    if (this.level >= gameState.newLifeLevel) {
        playSound('newlife');
        //console.log("new life");
        player.lives++;
        player.score += 250;
        gameState.newLifeLevel += 25;
    }

    gameState.score = this.score;
    gameState.lives = this.lives;
    gameState.level = this.level;

    //Each new level will update the difficulty just a little bit
    updateLevel();
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
    switch (this.dir) {
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
    ctx.drawImage(Resources.get(this.sprite), this.x + (50 - 50 * this.scale), this.y + (85 - 85 * this.scale), 101 * this.scale, 171 * this.scale);
};

//Keyboard input is used to determing player movements
Player.prototype.handleInput = function(key) {
    //console.log(key, this.x, this.y);

    //for (arrow in arrowControls)
    //{
    //    arrow = arrowControls[arrow];
    //    arrow.hovered = false;
    //}
    var movX = canvasWidth / 5;
    var movY = (canvasHeight - 100) / 6;

    playSound('move');
    arrowControls[key].keyed = true;

    switch (key) {
        case "left":
            //console.log("You pressed left");
            if (this.x - movX > -5) {
                this.dir = "left";
                this.col--;
                this.x = COL[this.col];
            }
            break;
        case "right":
            //console.log("You pressed right");
            if (this.x + movX < 410) {
                this.dir = "right";
                this.col++;
                this.x = COL[this.col];
            }
            break;
        case "up":
            //console.log("You pressed up");
            if (this.y - movY > -50) {
                this.dir = "up";
                this.row--;
                this.y = ROW[this.row];
            }
            break;
        case "down":
            //console.log("You pressed down");
            if (this.y + movY < 400) {
                this.dir = "down";
                this.row++;
                this.y = ROW[this.row];
            }
            break;
    }
};

//Generate Timer
var Timer = function() {
    this.reset();
};

//Reset in this context will restart timer at max time allowed
Timer.prototype.reset = function() {
    this.now = Date.now();
    this.maxTime = gameState.maxTime;
    this.min = Math.floor(this.maxTime / 60);
    this.sec = Math.floor(this.maxTime % 60);
    this.color = 'black';
    //console.log(this.min, this.sec, this.now);
};

//find out how much time has passed and reduce timer accordingly
Timer.prototype.update = function() {

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.last = this.now;
    this.now = Date.now();
    this.dt = (this.now - this.last) / 1000;
    this.maxTime -= this.dt;
    this.min = Math.floor(this.maxTime / 60);
    this.sec = Math.floor(this.maxTime % 60);

    //Alert player that time is almost up by changing text color
    if (this.maxTime < 60) {
        this.color = 'red';
    }

    //Tell player time is up
    if (this.maxTime < 0) {
        console.log("times up");
        player.handleTimesUp();
        this.reset();
    }
};

//Draw the timer
Timer.prototype.render = function() {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = this.color;
    ctx.fillText('Timer ' + this, 2.5, 45);
    ctx.restore();
};

//Used for rendering timer
Timer.prototype.toString = function() {
    var time = this.min + ':';

    if (this.sec < 10)
        time += '0' + this.sec;
    else
        time += this.sec;

    return time;
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


/*
--------------------- Canvas - Additional information ---------------------
*/
/*
//Draws the timer text on the canvas - top left - converted to its own entity
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
    ctx.textAlign = 'end'; // start, end, left, right, center
    ctx.textBaseline = 'alphabetic'; // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + player.score, 101 * 5, 45);
    ctx.restore();
}

//Draws the stars (indicating lives remaining) on the canvas - on right side bar
var rightSideBar = document.getElementById("right"); //grab the right side bar

function drawLives() {
    rightSideBarCtx.clearRect(0, 0, rightSideBar.width, rightSideBar.height);
    var y = 40;
    for (var i = 0, len = player.lives; i < len; i++) {
        rightSideBarCtx.drawImage(Resources.get('images/Star.png'), 10, y, 25, 43);
        y += 30;
    }
}

var arrowControls = {
    left: {
        x: rightSideBar.width / 2 - 5 - 30 - 5,
        y: rightSideBar.height - 30 * 3,
        w: 30,
        hovered: false,
        pressed: false,
        keyed: false,
        time: 0,
        code: 'left',
        images: ['images/round green/arrow-left.png', 'images/round blue/arrow-left.png']
    },
    right: {
        x: rightSideBar.width / 2 - 5 + 5,
        y: rightSideBar.height - 30 * 3,
        w: 30,
        hovered: false,
        pressed: false,
        keyed: false,
        time: 0,
        code: 'right',
        images: ['images/round green/arrow-right.png', 'images/round blue/arrow-right.png']
    },
    up: {
        x: rightSideBar.width / 2 - 5 - 30 / 2,
        y: rightSideBar.height - 30 * 3 - 30 + 5,
        w: 30,
        hovered: false,
        pressed: false,
        keyed: false,
        time: 0,
        code: 'up',
        images: ['images/round green/arrow-up.png', 'images/round blue/arrow-up.png']
    },
    down: {
        x: rightSideBar.width / 2 - 5 - 30 / 2,
        y: rightSideBar.height - 30 * 3 + 30 - 5,
        w: 30,
        hovered: false,
        pressed: false,
        keyed: false,
        time: 0,
        code: 'down',
        images: ['images/round green/arrow-down.png', 'images/round blue/arrow-down.png']
    }
};

function drawArrowControls(dt) {

    for (var arrow in arrowControls) {
        arrow = arrowControls[arrow];
        if (arrow.hovered)
            rightSideBarCtx.drawImage(Resources.get(arrow.images[1]), arrow.x, arrow.y, arrow.w, arrow.w);
        else if (arrow.keyed) {
            rightSideBarCtx.drawImage(Resources.get(arrow.images[1]), arrow.x, arrow.y, arrow.w, arrow.w);

            if (++arrow.time > 5) {
                arrow.keyed = false;
                arrow.time = 0;
            }
        } else
            rightSideBarCtx.drawImage(Resources.get(arrow.images[0]), arrow.x, arrow.y, arrow.w, arrow.w);
    }

}

//Respond the mouse movements
rightSideBar.addEventListener('mousemove', function(e) {
    var rect = rightSideBar.getBoundingClientRect();
    //console.log(e.clientX, e.clientY);
    document.body.style.cursor = "default";
    //Determine if a menu is active
    for (var arrow in arrowControls) {
        //If active, iterate through buttons

        arrow = arrowControls[arrow];

        //Mouse position reletive to canvas
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        arrow.hovered = false;

        //Check is mouse is positioned over arrow
        if ((mouseX > arrow.x) && (mouseX < (arrow.x + arrow.w)) &&
            (mouseY > arrow.y) && (mouseY < (arrow.y + arrow.w))) {
            arrow.hovered = true;
            document.body.style.cursor = "pointer";
        }

        //if mouse is not hovered over button, then button is not pressed...
        if (!arrow.hovered)
            arrow.pressed = false;
    }
});

//Respond to mouse down events
rightSideBar.addEventListener('mousedown', function(e) {
    //Determine if a menu is active
    for (var arrow in arrowControls) {

        arrow = arrowControls[arrow];

        arrow.pressed = false;

        if (arrow.hovered)
            arrow.pressed = true;
    }
});

//respond to click events
rightSideBar.addEventListener('mouseup', function(e) {
    //Determine if a menu is active
    for (var arrow in arrowControls) {
        arrow = arrowControls[arrow];

        if (arrow.hovered && arrow.pressed) {
            arrow.pressed = false;
            playSound('arrow');
            player.handleInput(arrow.code);
        }
    }
});

//Draws the sound icon to indicate whether sounds are muted or not - sounds can be muted by clicking the icon
var leftSideBar = document.getElementById("left"); //grab left side bar

function drawSoundBar() {
    leftSideBarCtx.clearRect(0, 0, leftSideBar.width, leftSideBar.height);
    if (soundOn)
        leftSideBarCtx.drawImage(Resources.get('images/sound-on.png'), 3, 3, 45, 45);
    else
        leftSideBarCtx.drawImage(Resources.get('images/sound-off.png'), 3, 3, 45, 45);
}

//Add mouse click listener to left side bar
leftSideBar.addEventListener('click', function(e) {
    var rect = leftSideBar.getBoundingClientRect();

    //Mouse position reletive to side bar
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    //Toggle sound if player clicks the icon
    if (y > 3 && y < 47 && x > 3 && x < 47) {
        if (soundOn === true) {
            soundOn = false;
            menus.sound = 'mute'; //toggle end/start menu sound
            drawSoundBar();
        } else if (soundOn === false) {
            soundOn = true;
            menus.sound = 'resume'; //toggle end/start menu sound
            drawSoundBar();
        }
    }
});

leftSideBar.addEventListener('mousemove', function(e) {
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