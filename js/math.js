var mathModes = ['easy', 'medium', 'hard', 'veryHard'];

//Math oparators...
var operators = ['+', '-', '*', '/'];

//Track Math Settings
var mathSettings = {
    mode: 'normal', //modes are normal, +, -, *, and /
    mathMode: 'easy', //easy, medium, hard, very hard
    maxAnswers: 3,
    maxPirates: 3,
    easy: {}, //Set with setMathSettings ()
    medium: {},
    hard: {},
    veryHard: {},
    original: {
        maxAnswers: 3,
        maxPirates: 3,
        easy: {
            operatorLevel: 1, //number of operators allowed (1: +, 2: + & -, 3: + - *, 4: all)
            plus: {
                oper1: [0, 10],
                oper2: [0, 2],
                level: 0,
                nextLevel: 5,
                incr: 5
            },
            minus: {
                oper1: [1, 10],
                oper2: [0, 2],
                level: 0,
                nextLevel: 5,
                incr: 5
            },
            multiplication: {
                oper1: [0, 12],
                oper2: [0, 2],
                level: 0,
                nextLevel: 10,
                incr: 10
            },
            division: {
                oper1: [1, 10],
                oper2: [1, 2],
                level: 0,
                nextLevel: 10,
                incr: 10
            }
        },
        medium: {
            operatorLevel: 2,
            plus: {
                oper1: [0, 25],
                oper2: [0, 25],
                level: 0,
                nextLevel: 3,
                incr: 3
            },
            minus: {
                oper1: [1, 25],
                oper2: [0, 25],
                level: 0,
                nextLevel: 3,
                incr: 3
            },
            multiplication: {
                oper1: [0, 12],
                oper2: [0, 6],
                level: 0,
                nextLevel: 8,
                incr: 7
            },
            division: {
                oper1: [1, 12],
                oper2: [1, 6],
                level: 0,
                nextLevel: 8,
                incr: 7
            }
        },
        hard: {
            operatorLevel: 4,
            plus: {
                oper1: [0, 100],
                oper2: [0, 100],
                level: 0,
                nextLevel: 2,
                incr: 2
            },
            minus: {
                oper1: [1, 100],
                oper2: [0, 100],
                level: 0,
                nextLevel: 2,
                incr: 2
            },
            multiplication: {
                oper1: [0, 12],
                oper2: [0, 12],
                level: 0,
                nextLevel: 5,
                incr: 5
            },
            division: {
                oper1: [1, 12],
                oper2: [1, 12],
                level: 0,
                nextLevel: 5,
                incr: 5
            }
        },
        veryHard: {
            operatorLevel: 4,
            plus: {
                oper1: [0, 1000],
                oper2: [0, 1000],
                level: 0,
                nextLevel: 1,
                incr: 1
            },
            minus: {
                oper1: [1, 1000],
                oper2: [0, 1000],
                level: 0,
                nextLevel: 2,
                incr: 2
            },
            multiplication: {
                oper1: [0, 20],
                oper2: [0, 20],
                level: 0,
                nextLevel: 2,
                incr: 2
            },
            division: {
                oper1: [1, 15],
                oper2: [1, 15],
                level: 0,
                nextLevel: 3,
                incr: 3
            }
        }
    }
};

function setMathSettings() {
    mathSettings.maxAnswers = mathSettings.original.maxAnswers;
    mathSettings.maxPirates = mathSettings.original.maxPirates;

    //set to math setting object (easy, medium, hard...)
    var newSetting = mathSettings[mathSettings.mathMode];
    //console.log(newSetting);
    var oldSetting = mathSettings.original[mathSettings.mathMode];
    //console.log(oldSetting);
    var oper = ['plus', 'minus', 'multiplication', 'division'];
    //build object
    newSetting.operatorLevel = oldSetting.operatorLevel;
    for (var i = 0; i < 4; i++) {
        console.log(newSetting[oper[i]]);
        newSetting[oper[i]] = Object.create(oldSetting[oper[i]]);
    }

    console.log(newSetting);
}

/*
--------------------- Entity ---------------------
mathGenerator will create a math equation and spawn 5 math boats.
At least one math boat will have the right answer and will level up the player.
Happy Pirate math boats will also level up - they don't conform to rules :).
Wrong math boats will reset player to start position
*/

var mathGenerator = function() {
    this.x = COL[2] - 34;
    this.y = 465;
    this.w = 174;
    this.h = 110;
    this.reset();
};

mathGenerator.prototype.reset = function() {
    mathBoats.length = 0; //delete all mathBoats.

    var math = mathSettings[mathSettings.mathMode];

    console.log(mathSettings.mathMode, math);
    console.log("Playing in ", mathSettings.mode, "mode");

    if (mathSettings.mode === 'normal')
        this.operator = operators[Math.floor(Math.random() * math.operatorLevel)];
    else
        this.operator = mathSettings.mode;

    switch (this.operator) {
        case '+':
            this.oper1 = Math.floor(Math.random() * math.plus.oper1[1]) + math.plus.oper1[0];
            this.oper2 = Math.floor(Math.random() * math.plus.oper2[1]) + math.plus.oper2[0];
            this.answer = this.oper1 + this.oper2;
            this.type = 'plus';
            break;
        case '-':
            do {
                this.oper1 = Math.floor(Math.random() * math.minus.oper1[1]) + math.minus.oper1[0];
                this.oper2 = Math.floor(Math.random() * math.minus.oper2[1]) + math.minus.oper2[0];
                this.answer = this.oper1 - this.oper2;
                this.type = 'minus';
            } while (this.answer < 0); //negative answers not allowed
            break;
        case '*':
            this.oper1 = Math.floor(Math.random() * math.multiplication.oper1[1]) + math.multiplication.oper1[0];
            this.oper2 = Math.floor(Math.random() * math.multiplication.oper2[1]) + math.multiplication.oper2[0];
            this.answer = this.oper1 * this.oper2;
            this.type = 'multiplication';
            break;
        case '/':
            //Randomly choose the divisor
            this.oper2 = Math.floor(Math.random() * math.division.oper2[1]) + math.division.oper2[0];
            console.log(this.oper2);
            //Randomly choose the dividend
            this.oper1 = this.oper2 * (Math.floor(Math.random() * math.division.oper1[1]) + math.division.oper1[0]);
            console.log(this.oper1);
            //Calculate the answer
            this.answer = this.oper1 / this.oper2;
            this.type = 'division';
            break;
    }

    this.formula = this.oper1 + this.operator + this.oper2;

    //Spawn 5 mathBoats
    var numAns = mathSettings.maxAnswers;
    var numPir = mathSettings.maxPirates;
    for (var i = 0; i < 5; i++) {
        //chosse a random state
        switch (Math.floor(Math.random() * 4)) {
            case 0: //True Answer Boat
                if (--numAns < 0) //Maximum allowed boats already spawned
                {
                    i--;
                    break;
                }
                console.log("True Boat");
                mathBoats.push(new mathBoat(i, true, this.answer));
                break;
            case 1: //Pirate Boad
                if (--numPir < 0) //maximum allowed boats already spawned
                {
                    i--;
                    break;
                }
                console.log('HappyPirate');
                mathBoats.push(new mathBoat(i, 'HappyPirate')); //Pirates don't need the answer!
                break;
            default: //False Answer Boat
                console.log("wrong boat");
                var wrong = this.answer;

                //false answer must not be negative either
                while (wrong === this.answer || wrong < 0)
                    wrong = this.answer + Math.floor(Math.random() * math[this.type].oper1[1]) - Math.floor(Math.random() * math[this.type].oper1[1]);

                mathBoats.push(new mathBoat(i, false, wrong));
        }
    }

    //Check to ensure at least one boat has a right answer
    if (numAns === mathSettings.maxAnswers) {
        console.log("change to true");
        var i = Math.floor(Math.random() * 5);
        mathBoats[i] = new mathBoat(i, true, this.answer);
    }
};

/*
mathGenerator.prototype.update = function() {
//nothing here...
}
*/
//Updates MathSettings with each new level
mathGenerator.prototype.updateLevel = function() {

    var math = mathSettings[mathSettings.mathMode];

    //tracks the level per operator type
    math[this.type].level++;
    console.log(this.type, "level = ", math[this.type].level);

    //increment operands if new level has been reached
    if (math[this.type].level == math[this.type].nextLevel) {
        math[this.type].nextLevel += math[this.type].incr;
        math[this.type].oper1[1]++;
        math[this.type].oper2[1]++;

        console.log(this.type, " range now ", math[this.type].oper1[1], math[this.type].oper2[1]);
    }

    //Every 25 levels, reduce pirate and answer boats
    if (gameState.level % 25 === 0) {
        if (mathSettings.maxAnswers > 1) //there must always be at least one answer boat.
            mathSettings.maxAnswers--;
        if (mathSettings.maxPirates > 0)
            mathSettings.maxPirates--;

        if (math.operatorLevel < 4 && mathSettings.mode === 'normal') {
            math.operatorLevel++;
            console.log("add operator number ", math.operatorLevel);
        }
    }
};

mathGenerator.prototype.render = function() {
    ctx.drawImage(Resources.get('images/sign-post-576727_640.png'), this.x, this.y, this.w, this.h);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 25px Comic Sans MS';
    ctx.textAlign = 'center'; // start, end, left, right, center
    ctx.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom

    ctx.strokeText(this.formula, this.x + this.w / 2, this.y + this.h / 3);
    ctx.fillText(this.formula, this.x + this.w / 2, this.y + this.h / 3);
};

/*
--------------------- Entity ---------------------
mathBoat is an entity that is either a happy pirate, has the right answer, or has the wrong math answer.
At least one math boat will have the right answer and will level up the player.
Happy Pirate math boats will also level up - they don't conform to rules :).
Wrong math boats will reset player to start position - the timer will not reset!
*/
var mathBoat = function(col, state, answer) {
    this.x = COL[col];
    this.y = ROW[0] + 70;

    this.state = state;
    this.answer = answer;

    //Used for animation control
    this.angle = 0;
    this.scale = 1; //not used

    if (Math.floor(Math.random() * 2) === 0) {
        this.clock = true; //go clockwise
        this.cMax = 0.1; //clockwise max
        this.aMax = 0.0; //anticlockwise max
        this.sprite = boats[0]; //assign boat to sprite
        this.xTextOffset = 30;
        this.yTextOffset = 65;
        this.textRotate = +Math.PI * 25 / 180;
    } else {
        this.clock = false; //go anticlockwise
        this.cMax = 0.0; //clockwise max
        this.aMax = -0.1; //anticlockwise max
        this.sprite = boats[1]; //assign boat to sprite
        this.xTextOffset = 65;
        this.yTextOffset = 30;
        this.textRotate = -Math.PI * 25 / 180;
    }
};
/*
mathBoat.prototype.reset = function() {

}
*/
mathBoat.prototype.update = function(dt) {

    //Controls boat animation
    if (this.angle > this.cMax)
        this.clock = false;

    if (this.angle < this.aMax)
        this.clock = true;

    if (this.clock)
        this.angle += dt / 25;
    else
        this.angle -= dt / 25;

    //Player has landed on boat
    if (player.y < -20 && player.x === this.x && animation.suspend === false)
        player.handleBoat(this.state); //pass to player state of boat - true/false/happy pirate
};

mathBoat.prototype.render = function() {
    ctx.save();
    ctx.translate(this.x + 50, this.y + 50);
    ctx.rotate(Math.PI * this.angle);

    ctx.translate(-this.x - 50, -this.y - 50);
    //console.log(Math.PI * this.angle);
    ctx.drawImage(Resources.get(this.sprite), this.x + (50 - 50 * this.scale), this.y + (85 - 85 * this.scale), 101, 101);


    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';
    ctx.font = 'bold 18px Comic Sans MS';
    ctx.textAlign = 'center'; // start, end, left, right, center
    ctx.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom

    if (this.answer !== undefined && this.state != 'HappyPirate') {
        //Additional rotation needed for text
        ctx.translate(this.x + 50, this.y + 50);
        ctx.rotate(this.textRotate);
        ctx.translate(-this.x - 50, -this.y - 50);

        ctx.strokeText(this.answer, this.x + this.xTextOffset, this.y + 40);
        ctx.fillText(this.answer, this.x + this.xTextOffset, this.y + 40);
    } else {
        //Additional rotation needed for text
        ctx.translate(this.x + 50, this.y + 50);
        ctx.rotate(Math.PI / 2 + this.textRotate);
        ctx.translate(-this.x - 50, -this.y - 50);

        ctx.strokeText(':)', this.x + 40, this.y + this.yTextOffset);
        ctx.fillText(':)', this.x + 40, this.y + this.yTextOffset);
    }

    ctx.restore();
};