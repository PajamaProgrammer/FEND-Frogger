var canvas = document.getElementById("main");   //grab the main canvas

//register canvas to listen to mouse events
canvas.addEventListener('mousemove', onCanvasMouseMove);
canvas.addEventListener('mousedown', onCanvasMouseDown);
canvas.addEventListener('mouseup', onCanvasMouseUp);

var menus = {
    sound: 'loop',
    start: {
      active: true,
      action: drawStartMenu,
      buttons: {
        left: {
          x: (canvas.width - 2) / 2 - 70,  // Canvas-relative.
          y: 225,                          // Canvas-relative.
          width: 70,
          height: 30,
          hovered: false,
          pressed: false,
          action: prevSprite
        },
        right: {
          x: (canvas.width - 2) / 2 + 5,  // Canvas-relative.
          y: 225,                         // Canvas-relative.
          width: 70,
          height: 30,
          hovered: false,
          pressed: false,
          action: nextSprite
        },
        play: {
          x: (canvas.width - 2) / 2 - 70,  // Canvas-relative.
          y: canvas.height - 80,          // Canvas-relative.
          width: 140,
          height: 40,
          hovered: false,
          pressed: false,
          action: start
        },
        git: {
          x: 10,                 // Canvas-relative.
          y: canvas.height - 35, // Canvas-relative.
          width: 25,
          height: 25,
          hovered: false,
          pressed: false,
          action: openGitHub
        }
      }
    },
    end: {
      active: false,
      action: drawEndMenu,
      buttons: {
        continue: {
          x: (canvas.width - 2) / 2 - 70,  // Canvas-relative.
          y: canvas.height - 80,           // Canvas-relative.
          width: 140,
          height: 40,
          hovered: false,
          pressed: false,
          action: restart
        },
        git: {
          x: 10,                 // Canvas-relative.
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

function prevSprite() {
    var i = sprites.indexOf(gameState.playerSprite);

    if (++i >= sprites.length)
        i = 0;

    gameState.playerSprite = sprites[i];
}

function nextSprite() {
    var i = sprites.indexOf(gameState.playerSprite);

    if (--i < 0)
        i = sprites.length - 1;

    gameState.playerSprite = sprites[i];
}

function openGitHub() {
    window.open('https://github.com/PajamaProgrammer/FEND-Frogger', '_blank');
}

function start() {
    playSound('startmenu', 'mute');
    menus.sound = 'resume';
    menus.start.active = false;
    newGame();
}

function restart() {
    menus.start.active = true;
    menus.end.active = false;
}

function drawEndMenu() {

    //console.log("end menu");
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
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('FROGGER CLONE: ', 2 * (canvas.width) / 3 - 10, 65);

    ctx.textAlign = 'start';
    ctx.font = '25px serif';
    ctx.fillText('Math Edition', 2 * (canvas.width) / 3 - 10, 65);

    //Draw line under title
    ctx.strokeStyle = '#666';
    ctx.strokeRect(35, 70, canvas.width-70, 1);

    //console.log(gameState.highScore);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'start';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';
    ctx.font = '22px serif';

    if (gameState.highScore > 0)
        ctx.fillText('New High Score!', 50, 150);
    else
        ctx.fillText('High Scores', 50, 150);

    for (var i = 0; i < gameState.highScoreRecord.scores.length; i++)
    {
        ctx.fillStyle = 'black';
        if(gameState.highScore - 1 === i)
            ctx.fillStyle = 'red';
        ctx.font = '20px serif';
        ctx.textAlign = 'end';
        var text = "#" + (i+1) + " :";
        ctx.fillText(text, 100, 175 + i*20);

        ctx.textAlign = 'start';
        text = " " + gameState.highScoreRecord.scores[i];
        ctx.fillText(text, 100, 175 + i*20);

        text = "- Level " + gameState.highScoreRecord.levels[i];
        ctx.font = '15px serif';
        ctx.fillText(text, 200, 175 + i*20);
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
    ctx.fillStyle = '#393';  // Same as title.
    ctx.font = '25px serif';
    ctx.textAlign = 'center';  // start, end, left, right, center
    ctx.textBaseline = 'middle';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Continue', x + w/2, y + h/2);

    //Draw GitHub icon - http://www.flaticon.com/free-icon/github-logo_25231
    x = menus.end.buttons.git.x;
    y = menus.end.buttons.git.y;
    w = menus.end.buttons.git.width;
    h = menus.end.buttons.git.height;

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.font = '18px serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'bottom';

    if (menus.end.buttons.git.pressed)
    {
        ctx.drawImage(Resources.get('images/github-logo_393.png'), x, y, w, h);
        ctx.fillStyle = '#393';
        ctx.fillText('GitHub', x + w+5, y+h);
    }
    else if (menus.end.buttons.git.hovered)
    {
        ctx.drawImage(Resources.get('images/github-logo_31FB03.png'), x, y, w, h);
        ctx.fillStyle = '#31FB03';
        ctx.fillText('GitHub', x + w+5, y+h);
    }
    else
        ctx.drawImage(Resources.get('images/github-logo_666.png'), x, y, w, h);
}

//Used to control sprite animation on menu
var scale = 1;
var up = true;

function drawStartMenu() {

    //Set up menu sound to loop

    if(menus.sound === 'loop')
    {
        playSound('startmenu', 'loop');
        menus.sound = 'acive';
    }
    //Toggle menu sound if it is not active
    if (menus.sound != 'active')
    {
        playSound('startmenu', menus.sound);
        menus.sound = 'active';
    }

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
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('FROGGER CLONE: ', 2 * (canvas.width) / 3 - 10, 65);

    ctx.textAlign = 'start';
    ctx.font = '25px serif';
    ctx.fillText('Math Edition', 2 * (canvas.width) / 3 - 10, 65);

    //Draw line under title
    ctx.strokeStyle = '#666';
    ctx.strokeRect(35, 70, canvas.width-70, 1);


    // Draw a preview of the player sprite. (size 101 x 171)
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.drawImage(Resources.get(gameState.playerSprite), (canvas.width - 2) / 2 - 50, 75 - scale*25 , 101, 171);

    //Controls animation of sprite, gives is a bouncy motion
    if (up === true)
        scale += 0.005;
    else
        scale -= 0.005;

    if (scale >= 1.3)
        up = false;
    if (scale <= 1)
        up = true;

    //Save some typing
    var x = menus.start.buttons.left.x;
    var y = menus.start.buttons.left.y;
    var w = menus.start.buttons.left.width;
    var h = menus.start.buttons.left.height;

    //Draw Next/Prev Buttons
    //Handle Left Button pressed/hovered states
    if (menus.start.buttons.left.pressed)
        ctx.strokeStyle = '#393';
    else if (menus.start.buttons.left.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Draw Prev Button
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    //Draw Arrow
    ctx.strokeStyle = '#393';
    ctx.beginPath();
    ctx.moveTo(x + 60, y + 15);  // Base of arrow.
    ctx.lineTo(x + 15, y + 15);  // Tip of arrow.
    ctx.lineTo(x + 30, y + 10);  // Top angle of arrow.
    ctx.moveTo(x + 15, y + 15);  // Tip of arrow.
    ctx.lineTo(x + 30, y + 20);  // Bottom angle of arrow.
    ctx.stroke();

    //Handle right Button pressed/hovered states
    if (menus.start.buttons.right.pressed)
        ctx.strokeStyle = '#393';
    else if (menus.start.buttons.right.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Updated x, y, w, h variables
    x = menus.start.buttons.right.x;
    y = menus.start.buttons.right.y;
    w = menus.start.buttons.right.width;
    h = menus.start.buttons.right.height;

    //Draw next
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    //Draw Arrow
    ctx.strokeStyle = '#393';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 15);  // Base of arrow.
    ctx.lineTo(x + 55, y + 15);  // Tip of arrow.
    ctx.lineTo(x + 40, y + 10);  // Top angle of arrow.
    ctx.moveTo(x + 55, y + 15);  // Tip of arrow.
    ctx.lineTo(x + 40, y + 20);  // Bottom angle of arrow.
    ctx.stroke();


    // Play button.
    //Handle play Button pressed/hovered states
    if (menus.start.buttons.play.pressed)
        ctx.strokeStyle = '#393';
    else if (menus.start.buttons.play.hovered)
        ctx.strokeStyle = '#31FB03';
    else
        ctx.strokeStyle = '#666';

    //Updated x, y, w, h variables
    x = menus.start.buttons.play.x;
    y = menus.start.buttons.play.y;
    w = menus.start.buttons.play.width;
    h = menus.start.buttons.play.height;

    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillStyle = '#393';  // Same as title.
    ctx.font = '25px serif';
    ctx.textAlign = 'center';  // start, end, left, right, center
    ctx.textBaseline = 'middle';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Play', x + w/2, y + h/2);


    //Draw Game instructions
    ctx.fillStyle = 'black';
    ctx.font = '18px serif';
    ctx.textAlign = 'start';  // start, end, left, right, center
    ctx.textBaseline = 'bottom';  // top, hanging, middle, alphabetic, ideographic, bottom

    y = canvas.height - 350;
    x = 10;
    w = 20;
    h = 34;


    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillText('Gems: common - extra points', 100, y+h);

    for (var item in collect)
    {
        if (item === 'key')
        {
            x = 30;
            y+= 30;

            ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
            ctx.fillText('Keys: rare - level up', 100, y + h-3);
        }
        else if (item === 'heart')
        {
            x = 30;
            y+= 30;

            ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
            ctx.fillText('Hearts: rare - extra life', 100, y + h-3);
        }
        else
            x+= 10;

        ctx.shadowColor = "rgba(64, 64, 64, 1.0)";
        ctx.drawImage(Resources.get(collect[item]), x, y, w, h);
    }

    w = 40;
    h = 66;
    x = 18;
    y+= 10;

    ctx.shadowColor = "rgba(64, 64, 64, 1.0)";
    ctx.drawImage(Resources.get('images/Rock.png'), x, y, w, h);
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillText('Rocks: obstacles - bounce', 100, y + h-10);
    y+= 40;
    ctx.drawImage(Resources.get('images/enemy-bug.png'), x, y, w, h);
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.fillText('Bugs: enemies - death', 100, y + h-15);


    y = canvas.height - 145;
    x = 25;

    ctx.fillText('Cross the sidewalk while picking up collectibles and avoiding', x, y);
    ctx.fillText('rocks and enemies.', x, y+25);



    //Draw GitHub icon - http://www.flaticon.com/free-icon/github-logo_25231
    x = menus.start.buttons.git.x;
    y = menus.start.buttons.git.y;
    w = menus.start.buttons.git.width;
    h = menus.start.buttons.git.height;

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.5)";
    ctx.font = '18px serif';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'bottom';

    if (menus.start.buttons.git.pressed)
    {
        ctx.drawImage(Resources.get('images/github-logo_393.png'), x, y, w, h);
        ctx.fillStyle = '#393';
        ctx.fillText('GitHub', x + w+5, y+h);
    }
    else if (menus.start.buttons.git.hovered)
    {
        ctx.drawImage(Resources.get('images/github-logo_31FB03.png'), x, y, w, h);
        ctx.fillStyle = '#31FB03';
        ctx.fillText('GitHub', x + w+5, y+h);
    }
    else
        ctx.drawImage(Resources.get('images/github-logo_666.png'), x, y, w, h);

    ctx.shadowColor = "rgba(0, 0, 0, 0)";
}

function onCanvasMouseMove(e)
{
    var rect = canvas.getBoundingClientRect();
    //console.log(e.clientX, e.clientY);
    document.body.style.cursor = "default";
    //Determine if a menu is active
    for (var menu in menus)
    {
        //If active, iterate through buttons
        if(menus[menu].active)
        {
            for (var button in menus[menu].buttons)
            {
                button = menus[menu].buttons[button];

                //Mouse position reletive to canvas
                var mouseX = e.clientX - rect.left;
                var mouseY = e.clientY - rect.top;

                button.hovered = false;

                //Check is mouse is positioned over button
                if ((mouseX > button.x) && (mouseX < (button.x + button.width)) &&
                    (mouseY > button.y) && (mouseY < (button.y + button.height)))
                {
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

function onCanvasMouseDown(e)
{
    //Determine if a menu is active
    for (var menu in menus)
    {
        //If active, iterate through buttons
        if(menus[menu].active)
        {
            for (var button in menus[menu].buttons)
            {
                button = menus[menu].buttons[button];

                button.pressed = false;

                if (button.hovered)
                    button.pressed = true;
            }
        }
    }
}

function onCanvasMouseUp(e)
{
    //Determine if a menu is active
    for (var menu in menus)
    {
        //If active, iterate through buttons
        if(menus[menu].active)
        {
            for (var button in menus[menu].buttons)
            {
                button = menus[menu].buttons[button];

                if (button.hovered && button.pressed)
                {
                    button.pressed = false;
                    playSound('click');
                    button.action();
                }
            }
        }
    }
}