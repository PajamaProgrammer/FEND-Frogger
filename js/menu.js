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
 * Menu.js - This file handles the menu interface for the player
 */
var canvas = document.getElementById("main"); //grab the main canvas

//register canvas to listen to mouse events
canvas.addEventListener('mousemove', onCanvasMouseMove);
canvas.addEventListener('mousedown', onCanvasMouseDown);
canvas.addEventListener('mouseup', onCanvasMouseUp);

//Track the game menus buttons and actions
var menus = {
    sound: 'loop', //code to initiate the theme music in loop mode
    start: {
        active: true,
        action: drawStartMenu,
        buttons: {
            left: {
                x: (canvas.width - 2) / 2 - 70, // Canvas-relative.
                y: 205, // Canvas-relative.
                width: 70,
                height: 30,
                hovered: false,
                pressed: false,
                action: prevSprite
            },
            right: {
                x: (canvas.width - 2) / 2 + 5, // Canvas-relative.
                y: 205, // Canvas-relative.
                width: 70,
                height: 30,
                hovered: false,
                pressed: false,
                action: nextSprite
            },
            play: {
                x: (canvas.width - 2) / 2 - 75, // Canvas-relative.
                y: canvas.height - 80, // Canvas-relative.
                width: 150,
                height: 40,
                hovered: false,
                pressed: false,
                action: drawSubStartMenu
            },
            next: {
                x: (canvas.width - 2) / 2 + 80, // Canvas-relative.
                y: canvas.height - 80, // Canvas-relative.
                width: 40,
                height: 40,
                hovered: false,
                pressed: false,
                action: nextMode
            },
            prev: {
                x: (canvas.width - 2) / 2 - 120, // Canvas-relative.
                y: canvas.height - 80, // Canvas-relative.
                width: 40,
                height: 40,
                hovered: false,
                pressed: false,
                action: prevMode
            },
            git: {
                x: 10, // Canvas-relative.
                y: canvas.height - 35, // Canvas-relative.
                width: 25,
                height: 25,
                hovered: false,
                pressed: false,
                action: openGitHub
            }
        }
    },
    startSub: {
        active: false,
        action: drawStartMenu,
        buttons: { //Will build Dynamicaly
        }
    },
    end: {
        active: false,
        action: drawEndMenu,
        buttons: {
            continue: {
                x: (canvas.width - 2) / 2 - 75, // Canvas-relative.
                y: canvas.height - 80, // Canvas-relative.
                width: 150,
                height: 40,
                hovered: false,
                pressed: false,
                action: restart
            },
            git: {
                x: 10, // Canvas-relative.
                y: canvas.height - 35, // Canvas-relative.
                width: 25,
                height: 25,
                hovered: false,
                pressed: false,
                action: openGitHub
            }
        }
    }
};

//iterates through the possible math modes, var operators = ['+', '-', '*', '/'];
function nextMode() {

    //If start menu is active, then scroll through the different game modes - normal, addition only, subtraction only, etc
    if (menus.start.active) {
        if (mathSettings.mode === 'normal') {
            mathSettings.mode = operators[0];
            return;
        }

        var i = operators.indexOf(mathSettings.mode);

        if (++i >= operators.length) {
            mathSettings.mode = 'normal';
            return;
        }

        mathSettings.mode = operators[i];
        return;
    }

    //If start sub menu is active, then scroll through the difficulty settings
    if (menus.startSub.active) {
        var i = mathModes.indexOf(mathSettings.mathMode);

        if (++i >= mathModes.length)
            i = 0;
        mathSettings.mathMode = mathModes[i];
    }

}

function prevMode() {

    //If start menu is active, then scroll through the different game modes - normal, addition only, subtraction only, etc
    if (menus.start.active) {
        if (mathSettings.mode === 'normal') {
            mathSettings.mode = operators[operators.length - 1];
            return;
        }

        var i = operators.indexOf(mathSettings.mode);

        if (--i < 0) {
            mathSettings.mode = 'normal';
            return;
        }

        mathSettings.mode = operators[i];
        return;
    }

    //If start sub menu is active, then scroll through the difficulty settings
    if (menus.startSub.active) {
        var i = mathModes.indexOf(mathSettings.mathMode);

        if (--i < 0)
            i = mathModes.length - 1;
        mathSettings.mathMode = mathModes[i];
    }
}

//Used for selecting which spite to preview
function prevSprite() {
    var i = sprites.indexOf(gameState.playerSprite);

    if (++i >= sprites.length)
        i = 0;

    gameState.playerSprite = sprites[i];
}

//Used for selecting which spite to preview
function nextSprite() {
    var i = sprites.indexOf(gameState.playerSprite);

    if (--i < 0)
        i = sprites.length - 1;

    gameState.playerSprite = sprites[i];
}

//Opens a new webpage to the game's gitHub account - TODO change link to issues or feedback page
function openGitHub() {
    window.open('https://github.com/PajamaProgrammer/FEND-Frogger', '_blank');
}

//Initiates a new game
function start() {
    playSound('startmenu', 'mute'); //actually pauses the game theme song
    menus.sound = 'resume'; //code to resume theme song next time start menu is drawn
    menus.start.active = false;
    menus.startSub.active = false;

    newGame();
}

//This menu is actually the same as the start menu, the only difference is with the play button action
function drawSubStartMenu() {
    menus.start.active = false;
    menus.startSub.active = true;

    //console.log("Draw sub menu");

    //Dynamically build buttons for submenu
    //buttons are exactly the same as start, just a single difference in the play button action method...
    for (var button in menus.start.buttons) {
        menus.startSub.buttons[button] = Object.create(menus.start.buttons[button]); //JSON objects are passed by reference, use Object.create to avoid reference issues
        if (button === 'play')
            menus.startSub.buttons[button].action = start;
    }

    //console.log(menus.start.buttons, menus.startSub.buttons);
}

//used for restarting a new game, simply sets the start menu as active
function restart() {
    menus.start.active = true;
    menus.end.active = false;
}

//Draw High score menu, I named this function drawEndMenu because it appears at the end of the game...
function drawEndMenu() {

    //console.log("end menu");

    // Draw the background.
    drawMenuBackGnd();

    //console.log(gameState.highScore);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'start'; // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';
    ctx.font = '22px serif';

    if (gameState.highScore > 0)
        ctx.fillText('New High Score!', 50, 150);
    else
        ctx.fillText('Your High Scores:', 50, 150);

    //Draw the High Scores to Menu
    for (var i = 0; i < gameState.highScoreRecord.scores.length; i++) {
        ctx.fillStyle = 'black';
        if (gameState.highScore - 1 === i)
            ctx.fillStyle = 'red';
        ctx.font = '20px serif';
        ctx.textAlign = 'end';
        var text = "#" + (i + 1) + " :";
        ctx.fillText(text, 100, 175 + i * 20);

        ctx.textAlign = 'start';
        text = " " + gameState.highScoreRecord.scores[i];
        ctx.fillText(text, 100, 175 + i * 20);

        text = "- Level " + gameState.highScoreRecord.levels[i];
        ctx.font = '15px serif';
        ctx.fillText(text, 225, 175 + i * 20);

        text = gameState.highScoreRecord.modes[i];
        ctx.font = '15px serif';
        ctx.fillText(text, 300, 175 + i * 20);
    }

    //Continue button.
    //Handle continue Button pressed/hovered states
    if (menus.end.buttons.continue.pressed)
        ctx.strokeStyle = '#393';
    else if (menus.end.buttons.continue.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //x, y, w, h variables
    var x = menus.end.buttons.continue.x;
    var y = menus.end.buttons.continue.y;
    var w = menus.end.buttons.continue.width;
    var h = menus.end.buttons.continue.height;

    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillStyle = '#393'; // Same as title.
    ctx.font = '25px serif';
    ctx.textAlign = 'center'; // start, end, left, right, center
    ctx.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Continue', x + w / 2, y + h / 2);

}

//Used to control sprite animation on menu
var scale = 1;
var up = true;

function drawStartMenu() {

    //console.log("start menu");

    //Set up menu sound to loop
    if (menus.sound === 'loop') {
        playSound('startmenu', 'loop');
        menus.sound = 'acive';
    }
    //Toggle menu sound if it is not active
    if (menus.sound != 'active') {
        playSound('startmenu', menus.sound);
        menus.sound = 'active';
    }

    // Draw the background.
    drawMenuBackGnd();

    // Draw a preview of the player sprite. (size 101 x 171)
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.drawImage(Resources.get(gameState.playerSprite), (canvas.width - 2) / 2 - 50, 65 - scale * 25, 101, 171);

    //Controls animation of sprite, gives it a bouncy motion
    if (up === true)
        scale += 0.005;
    else
        scale -= 0.005;

    if (scale >= 1.3)
        up = false;
    if (scale <= 1)
        up = true;


    //Grab the active menu
    var activeMenu;
    for (var menu in menus)
        if (menus[menu].active)
            activeMenu = menus[menu];
        //Save some typing
    var x = activeMenu.buttons.left.x;
    var y = activeMenu.buttons.left.y;
    var w = activeMenu.buttons.left.width;
    var h = activeMenu.buttons.left.height;

    //Draw left/right Buttons
    //Handle Left Button pressed/hovered states
    if (activeMenu.buttons.left.pressed)
        ctx.strokeStyle = '#393';
    else if (activeMenu.buttons.left.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Draw left Button
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    //Draw Arrow
    ctx.strokeStyle = '#393';
    ctx.beginPath();
    ctx.moveTo(x + 60, y + 15); // Base of arrow.
    ctx.lineTo(x + 15, y + 15); // Tip of arrow.
    ctx.lineTo(x + 30, y + 10); // Top angle of arrow.
    ctx.moveTo(x + 15, y + 15); // Tip of arrow.
    ctx.lineTo(x + 30, y + 20); // Bottom angle of arrow.
    ctx.stroke();

    //Handle right Button pressed/hovered states
    if (activeMenu.buttons.right.pressed)
        ctx.strokeStyle = '#393';
    else if (activeMenu.buttons.right.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Updated x, y, w, h variables
    x = activeMenu.buttons.right.x;
    y = activeMenu.buttons.right.y;
    w = activeMenu.buttons.right.width;
    h = activeMenu.buttons.right.height;

    //Draw right
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    //Draw Arrow
    ctx.strokeStyle = '#393';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 15); // Base of arrow.
    ctx.lineTo(x + 55, y + 15); // Tip of arrow.
    ctx.lineTo(x + 40, y + 10); // Top angle of arrow.
    ctx.moveTo(x + 55, y + 15); // Tip of arrow.
    ctx.lineTo(x + 40, y + 20); // Bottom angle of arrow.
    ctx.stroke();


    // Play button.
    //Handle play Button pressed/hovered states
    if (activeMenu.buttons.play.pressed)
        ctx.strokeStyle = '#393';
    else if (activeMenu.buttons.play.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Updated x, y, w, h variables
    x = activeMenu.buttons.play.x;
    y = activeMenu.buttons.play.y;
    w = activeMenu.buttons.play.width;
    h = activeMenu.buttons.play.height;

    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillStyle = '#393'; // Same as title.
    ctx.font = '25px serif';
    ctx.textAlign = 'center'; // start, end, left, right, center
    ctx.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom

    //Determine which settings to display based on which menue is active
    if (menus.start.active)
        switch (mathSettings.mode) {
            case '+':
                ctx.fillText('Addition', x + w / 2, y + h / 2);
                break;
            case '-':
                ctx.fillText('Subtraction', x + w / 2, y + h / 2);
                break;
            case '*':
                ctx.fillText('Multiplication', x + w / 2, y + h / 2);
                break;
            case '/':
                ctx.fillText('Division', x + w / 2, y + h / 2);
                break;
            default:
                ctx.fillText('Play', x + w / 2, y + h / 2);
        }
    if (menus.startSub.active)
        switch (mathSettings.mathMode) {
            case 'easy':
                ctx.fillText('Easy', x + w / 2, y + h / 2);
                break;
            case 'medium':
                ctx.fillText('Medium', x + w / 2, y + h / 2);
                break;
            case 'hard':
                ctx.fillText('Hard', x + w / 2, y + h / 2);
                break;
            case 'veryHard':
                ctx.fillText('Very Hard!', x + w / 2, y + h / 2);
                break;
            default:
                ctx.fillText('Play', x + w / 2, y + h / 2);
        }

    //Draw Game instructions
    ctx.fillStyle = 'black';
    ctx.font = '18px serif';
    ctx.textAlign = 'start'; // start, end, left, right, center
    ctx.textBaseline = 'bottom'; // top, hanging, middle, alphabetic, ideographic, bottom

    y = canvas.height - 360;
    x = 10;
    w = 20;
    h = 34;


    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillText('Gems: Common collectibles worth extra points', 100, y + h);

    for (var item in collect) {
        if (item === 'key') {
            x = 30;
            y += 30;

            ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
            ctx.fillText('Keys: Rare, automatic level up', 100, y + h - 3);
        } else if (item === 'heart') {
            x = 30;
            y += 30;

            ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
            ctx.fillText('Hearts: Rare, worth an extra life', 100, y + h - 3);
        } else
            x += 10;

        ctx.shadowColor = "rgba(64, 64, 64, 1.0)";
        ctx.drawImage(Resources.get(collect[item]), x, y, w, h);
    }

    w = 40;
    h = 66;
    x = 18;
    y += 10;

    ctx.shadowColor = "rgba(64, 64, 64, 1.0)";
    ctx.drawImage(Resources.get('images/Rock.png'), x, y, w, h);
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillText('Rocks: Obstacles that block the way', 100, y + h - 10);
    y += 40;
    ctx.shadowColor = "rgba(64, 64, 64, 1.0)";
    ctx.drawImage(Resources.get('images/enemy-bug.png'), x, y, w, h);
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillText('Killer Bugs: Careful! They bring certain death', 100, y + h - 15);


    y = canvas.height - 165;
    x = canvas.width / 2;
    ctx.textAlign = 'center';

    ctx.fillText('In a world overrun by bugs, the only escape to safety is by boat. ', x, y);
    ctx.fillText('Look to the wooden sign.', x, y + 25);
    ctx.fillText('Then choose your escape boat wisely.', x, y + 50);

    ctx.shadowColor = "rgba(64, 64, 64, 1.0)";
    x = canvas.width - 25;
    w = 66;
    h = 66;
    ctx.drawImage(Resources.get('images/sign-post-576727_640.png'), 25, y, 87, 55);
    ctx.drawImage(Resources.get('images/ship_wood_cc0 (1).png'), x - w, y, w, h);


    //draw next/prev button
    //Handle next Button pressed/hovered states
    if (activeMenu.buttons.next.pressed)
        ctx.strokeStyle = '#393';
    else if (activeMenu.buttons.next.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Updated x, y, w, h variables
    x = menus.start.buttons.next.x;
    y = menus.start.buttons.next.y;
    w = menus.start.buttons.next.width;
    h = menus.start.buttons.next.height;

    //Draw next
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    //Draw Arrow
    ctx.strokeStyle = '#393';
    ctx.beginPath();
    ctx.moveTo(x + w / 5, y + h / 2); // Base of arrow.
    ctx.lineTo(x + 4 * w / 5, y + h / 2); // Tip of arrow.
    ctx.lineTo(x + 3 * w / 5, y + h / 2 - 5); // Top angle of arrow.
    ctx.moveTo(x + 4 * w / 5, y + h / 2); // Tip of arrow.
    ctx.lineTo(x + 3 * w / 5, y + h / 2 + 5); // Bottom angle of arrow.
    ctx.stroke();

    //draw next/prev button
    //Handle prev Button pressed/hovered states
    if (activeMenu.buttons.prev.pressed)
        ctx.strokeStyle = '#393';
    else if (activeMenu.buttons.prev.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Updated x, y, w, h variables
    x = activeMenu.buttons.prev.x;
    y = activeMenu.buttons.prev.y;
    w = activeMenu.buttons.prev.width;
    h = activeMenu.buttons.prev.height;

    //Draw next
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    //Draw Arrow
    ctx.strokeStyle = '#393';
    ctx.beginPath();
    ctx.moveTo(x + 4 * w / 5, y + h / 2); // Base of arrow.
    ctx.lineTo(x + w / 5, y + h / 2); // Tip of arrow.
    ctx.lineTo(x + 2 * w / 5, y + h / 2 - 5); // Top angle of arrow.
    ctx.moveTo(x + w / 5, y + h / 2); // Tip of arrow.
    ctx.lineTo(x + 2 * w / 5, y + h / 2 + 5); // Bottom angle of arrow.
    ctx.stroke();

    ctx.shadowColor = "rgba(0, 0, 0, 0)";
}

//Draws the common features of all menus
function drawMenuBackGnd() {
    // Draw the background.
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#393';
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 6, canvas.width, canvas.height - 6);
    ctx.strokeRect(1, 6, canvas.width - 2, canvas.height - 7);

    // Draw the title.
    ctx.fillStyle = '#393';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.font = '32px serif';
    ctx.textAlign = 'end'; // start, end, left, right, center
    ctx.textBaseline = 'alphabetic'; // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('FROGGER CLONE: ', 2 * (canvas.width) / 3 - 10, 65);

    ctx.textAlign = 'start';
    ctx.font = '25px serif';
    ctx.fillText('Math Edition', 2 * (canvas.width) / 3 - 10, 65);

    //Draw line under title
    ctx.strokeStyle = '#666';
    ctx.strokeRect(35, 70, canvas.width - 70, 1);

    //grabe the active menu
    var activeMenu;
    for (var menu in menus)
        if (menus[menu].active)
            activeMenu = menus[menu];

        //Draw GitHub icon - http://www.flaticon.com/free-icon/github-logo_25231
    var x = activeMenu.buttons.git.x;
    var y = activeMenu.buttons.git.y;
    var w = activeMenu.buttons.git.width;
    var h = activeMenu.buttons.git.height;

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.font = '18px serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'bottom';

    //handle git hovered/pressed states - gitHub images from http://www.flaticon.com/free-icon/github-logo_25231
    if (activeMenu.buttons.git.pressed) {
        ctx.drawImage(Resources.get('images/github-logo_393.png'), x, y, w, h);
        ctx.fillStyle = '#393';
        ctx.fillText('GitHub', x + w + 5, y + h);
    } else if (activeMenu.buttons.git.hovered) {
        ctx.drawImage(Resources.get('images/github-logo_31FB03.png'), x, y, w, h);
        ctx.fillStyle = '#31FB03';
        ctx.fillText('GitHub', x + w + 5, y + h);
    } else
        ctx.drawImage(Resources.get('images/github-logo_666.png'), x, y, w, h);
}

//Respond the mouse movements
function onCanvasMouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    //console.log(e.clientX, e.clientY);
    document.body.style.cursor = "default";
    //Determine if a menu is active
    for (var menu in menus) {
        //If active, iterate through buttons
        if (menus[menu].active) {
            for (var button in menus[menu].buttons) {
                button = menus[menu].buttons[button];

                //Mouse position reletive to canvas
                var mouseX = e.clientX - rect.left;
                var mouseY = e.clientY - rect.top;

                button.hovered = false;

                //Check is mouse is positioned over button
                if ((mouseX > button.x) && (mouseX < (button.x + button.width)) &&
                    (mouseY > button.y) && (mouseY < (button.y + button.height))) {
                    button.hovered = true;
                    document.body.style.cursor = "pointer";
                }

                //if mouse is not hovered over button, then button is not pressed...
                if (!button.hovered)
                    button.pressed = false;
            }
        }
    }
}

//Respond to mouse down events
function onCanvasMouseDown(e) {
    //Determine if a menu is active
    for (var menu in menus) {
        //If active, iterate through buttons
        if (menus[menu].active) {
            for (var button in menus[menu].buttons) {
                button = menus[menu].buttons[button];

                button.pressed = false;

                if (button.hovered)
                    button.pressed = true;
            }
        }
    }
}

//respond to click events
function onCanvasMouseUp(e) {
    //Determine if a menu is active
    for (var menu in menus) {
        //If active, iterate through buttons
        if (menus[menu].active) {
            for (var button in menus[menu].buttons) {
                button = menus[menu].buttons[button];

                if (button.hovered && button.pressed) {
                    button.pressed = false;
                    playSound('click');
                    button.action();
                }
            }
        }
    }
}