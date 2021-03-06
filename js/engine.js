/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),

        //Right and Left SideBar Canvas
        rightSideBar = doc.createElement('canvas'),
        rightSideBarCtx = rightSideBar.getContext('2d'),
        leftSideBar = doc.createElement('canvas'),
        leftSideBarCtx = leftSideBar.getContext('2d'),
        lastTime;

    canvas.setAttribute("id", "main");
    rightSideBar.setAttribute("id", "right");
    leftSideBar.setAttribute("id", "left");

    leftSideBar.width = 50;
    leftSideBar.height = 606;
    doc.body.appendChild(leftSideBar);

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    rightSideBar.width = 100;
    rightSideBar.height = canvas.height;
    doc.body.appendChild(rightSideBar);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {

        drawSoundBar();
        var activeMenu = false;
        //If there is an active menu, draw it and set flag
        for (var menu in menus)
        {
            if (menus[menu].active)
            {
                menus[menu].action();
                activeMenu = true;
            }
        }


        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;


        if(!activeMenu)
        {
            /* Call our update/render functions, pass along the time delta to
            * our update function since it may be used for smooth animation.
            */
            update(dt);
            render();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        //checkCollisions();
    }

    //function checkCollisions() {

    //}

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allRocks.forEach(function(rock) {
            rock.update(dt);
        });

        allCollectibles.forEach(function(collectible) {
            collectible.update(dt);
        });

        player.update(dt);

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        mathBoats.forEach(function(boat) {
            boat.update(dt);
        });

        gameTimer.update();
        //mathSign.update();    //Not implemented
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 4 of stone
                'images/stone-block.png',   // Row 2 of 4 of stone
                'images/stone-block.png',   // Row 3 of 4 of stone
                'images/stone-block.png',   // Row 4 of 4 of grass
                'images/grass-block.png'    // Row 1 of 1 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // Draw the score.
        drawScore();
        drawLevel();
        drawLives();
        drawArrowControls();
        //drawTimer();


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allCollectibles.forEach(function(collectible) {
            collectible.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allRocks.forEach(function(rock) {
            rock.render();
        });

        mathBoats.forEach(function(boat) {
            boat.render();
        });

        player.render();
        gameTimer.render();
        mathSign.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Star.png',
        'images/Rock.png',
        'images/sound-on.png',
        'images/sound-off.png',
        'images/sign-post-576727_640.png',  //image from https://pixabay.com/en/sign-post-signage-wood-wooden-576727/
        'images/ship_wood_cc0 (1).png',     //image from http://opengameart.org/content/simple-generic-ship
        'images/ship_wood_cc0 (2).png',     //image from http://opengameart.org/content/simple-generic-ship
        'images/github-logo_31FB03.png',    //gitHub images from http://www.flaticon.com/free-icon/github-logo_25231
        'images/github-logo_393.png',
        'images/github-logo_666.png',
        'images/round green/arrow-down.png',    //arrow images from http://www.graphicsfuel.com/2010/12/arrow-buttons-psd-pack/
        'images/round green/arrow-up.png',
        'images/round green/arrow-left.png',
        'images/round green/arrow-right.png',
        'images/round blue/arrow-down.png',    //arrow images from http://www.graphicsfuel.com/2010/12/arrow-buttons-psd-pack/
        'images/round blue/arrow-up.png',
        'images/round blue/arrow-left.png',
        'images/round blue/arrow-right.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.rightSideBarCtx = rightSideBarCtx;
    global.leftSideBarCtx = leftSideBarCtx;
})(this);
