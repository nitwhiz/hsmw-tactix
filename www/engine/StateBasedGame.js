/**
 * StateBasedGame holds states and initiates ticking and rendering of the current state at a fixed fps rate on start.
 * @constructor
 * @param {HTMLCanvasElement} screenNode - The HTML5 Canvas to render on
 * @param {Object} settings - Game specific settings, this object extends the defaultSettings
 */
var StateBasedGame = function(screenNode, settings) {
	/**
	 * The HTMLCanvasElement passed to the constructor
	 * @type {HTMLCanvasElement}
	 */
	this.screenNode = screenNode;

	/**
	 * The settings after extending the defaultSettings
	 * @type {Object}
	 */
	this.settings = Utils.extend(StateBasedGame.defaultSettings, settings);

	if (!(this.screenNode instanceof HTMLCanvasElement)) {
		console.error('provided screenNode is not a canvas!');
	}

	/**
	 * The rendering context of the passed screenNode
	 * @type {CanvasRenderingContext2D}
	 */
	this.context2d = this.screenNode.getContext('2d');

	var lastFrame = 0;

	var gameStates = {};

	var currentGameState = '';
	var nextGameState = '';

	var isFadingOut = false;
	var isFadingIn = false;

	var fadingOpacity = 0;

	var lastDelta = 0;

	var scheduledTasks = [];

	var keyboard = [];
	var mouse = {
		x: 0,
		y: 0,
		pressed: [false, false, false]
	};

	/**
	 * Fires initializers for canvas, events and states
	 */
	this.init = function() {
		this.initCanvas();
		this.initEvents();
		this.initStates();
	};

	/**
	 * Initializes canvas
	 */
	this.initCanvas = function() {
		this.setSize(this.settings.screenWidth, this.settings.screenHeight);
		this.setScale(this.settings.scale);

		this.setPixelated(this.settings.pixelated);

		this.setFont(this.settings.font);

		this.screenNode.addEventListener('contextmenu', function(event) {
			event.preventDefault();
		});
	};

	/**
	 * Initializes events
	 */
	this.initEvents = function() {
		this.screenNode.addEventListener('click', function(event) {
			if (
				typeof gameStates[currentGameState].onMouseClick === 'function'
			) {
				gameStates[currentGameState].onMouseClick(event);
			}
		});

		this.screenNode.addEventListener(
			'mousedown',
			function(event) {
				mouse.x = event.offsetX;
				mouse.y = event.offsetY;

				mouse.pressed[event.which - 1] = true;

				if (
					typeof gameStates[currentGameState].onMouseDown ===
					'function'
				) {
					gameStates[currentGameState].onMouseDown(event);
				}
			}.bind(this)
		);

		this.screenNode.addEventListener(
			'mouseup',
			function(event) {
				mouse.x = event.offsetX;
				mouse.y = event.offsetY;

				mouse.pressed[event.which - 1] = false;

				if (
					typeof gameStates[currentGameState].onMouseUp === 'function'
				) {
					gameStates[currentGameState].onMouseUp(event);
				}
			}.bind(this)
		);

		this.screenNode.addEventListener(
			'mousemove',
			function(event) {
				mouse.x = event.offsetX;
				mouse.y = event.offsetY;

				if (
					typeof gameStates[currentGameState].onMouseMove ===
					'function'
				) {
					gameStates[currentGameState].onMouseMove(event);
				}
			}.bind(this)
		);

		document.addEventListener(
			'keydown',
			function(event) {
				keyboard[event.keyCode] = true;

				if (
					typeof gameStates[currentGameState].onKeyDown === 'function'
				) {
					gameStates[currentGameState].onKeyDown(event);
				}
			}.bind(this)
		);

		document.addEventListener(
			'keyup',
			function(event) {
				keyboard[event.keyCode] = false;

				if (
					typeof gameStates[currentGameState].onKeyUp === 'function'
				) {
					gameStates[currentGameState].onKeyUp(event);
				}
			}.bind(this)
		);
	};

	/**
	 * Initializes states
	 */
	this.initStates = function() {
		for (var state in gameStates) {
			if (gameStates.hasOwnProperty(state)) {
				gameStates[state].init();
			}
		}
	};

	/**
	 * Adds a GameState.
	 * The first ever added will be the default start state
	 * @param {String} id - Unique identifier to switch to this state
	 * @param {GameState} gameState - The GameState instance to add
	 */
	this.addState = function(id, gameState) {
		gameStates[id] = gameState;

		if (currentGameState === '') {
			currentGameState = id;
		}
	};

	/**
	 * Switch the currently ticking and rendering state.
	 * Happens with a nice fading effect
	 * @param {String} id - The id of the GameState
	 */
	this.switchState = function(id) {
		if (!gameStates[id]) {
			console.error('no gamestate w/ id `' + id + '`!');
		}

		if (id === currentGameState) {
			console.warn('tried to switch into active gamestate, ignoring.');
			return;
		}

		isFadingOut = true;
		nextGameState = id;
	};

	/**
	 * Change weather the canvas should render pixelated
	 * @param {Boolean} pixelated - True for pixelated
	 */
	this.setPixelated = function(pixelated) {
		this.screenNode.style.imageRendering = pixelated ? 'pixelated' : 'auto';
		this.context2d.imageSmoothingEnabled = !pixelated;
	};

	/**
	 * Resizes the canvas
	 * @param {Number} newWidth - The new width
	 * @param {Number} newHeight - The new height
	 */
	this.setSize = function(newWidth, newHeight) {
		this.screenNode.width = newWidth;
		this.screenNode.height = newHeight;
	};

	/**
	 * Scale the canvas
	 * @param {Number} newScale - The new scale
	 */
	this.setScale = function(newScale) {
		this.screenNode.style.transform =
			'translateX(-50%) translateY(-50%) scale(' + newScale + ')';
	};

	/**
	 * Set the default font of the canvas.
	 * Additionally resets the textBaseline property of the canvas to 'top' when called
	 * @param {String} font - The font string
	 */
	this.setFont = function(font) {
		this.context2d.font = font;
		this.context2d.textBaseline = 'top';
	};

	/**
	 * Clear the canvas
	 */
	this.ctxClearScreen = function() {
		this.context2d.clearRect(
			0,
			0,
			this.settings.screenWidth,
			this.settings.screenHeight
		);
	};

	/**
	 * Returns true if the specified mouse key is currently held down
	 * @param {Number} key - The keyCode of the mouse key in question
	 * @returns {Boolean}
	 */
	this.mouseKeyPressed = function(key) {
		if (typeof key === 'undefined') {
			return mouse.pressed[0] || mouse.pressed[1] || mouse.pressed[2];
		}

		return mouse.pressed[key];
	};

	/**
	 * Returns true if the specified key is currently held down
	 * @param {Number} key - The keyCode of the key in question
	 * @returns {Boolean}
	 */
	this.keyboardKeyPressed = function(key) {
		return !!keyboard[key];
	};

	/**
	 * Schedules a function to be called after a specified delay.
	 * Happens in sync with game ticking, after it's own tick.
	 * Tasks are StateBasedGame bound, not GameState bound, so they won't be cancelled on switchState
	 * @param {Number} msDelay - Delay in milliseconds
	 * @param {Function} callback - A function to be called
	 */
	this.scheduleTask = function(msDelay, callback) {
		scheduledTasks.push({
			delay: msDelay,
			callback: callback
		});
	};

	/**
	 * Tick the current GameState and scheduled tasks
	 * @param {Number} delta - Time passed after last tick in milliseconds
	 */
	this.tick = function(delta) {
		if (!(isFadingOut || isFadingIn)) {
			gameStates[currentGameState].tick(delta);
		}

		for (var i = 0, l = scheduledTasks.length; i < l; ++i) {
			scheduledTasks[i].delay -= delta;

			if (scheduledTasks[i].delay <= 0) {
				scheduledTasks[i].callback();

				scheduledTasks.splice(i, 1);
				--l;
			}
		}

		lastDelta = delta;
	};

	/**
	 * Render the current GameState.
	 * Also renders the GameState switching fade effect if necessary.
	 * Doesn't clear the screen
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.render = function(context2d) {
		gameStates[currentGameState].render(context2d);

		if (isFadingOut) {
			if (fadingOpacity < 1) {
				fadingOpacity += lastDelta / 750;
			} else {
				isFadingOut = false;
				isFadingIn = true;
				currentGameState = nextGameState;
			}
		} else if (isFadingIn) {
			if (fadingOpacity > 0) {
				fadingOpacity -= lastDelta / 750;
			} else {
				isFadingIn = false;
			}
		}

		if (isFadingOut || isFadingIn) {
			context2d.fillStyle =
				'rgba(0, 0, 0, ' +
				Math.max(Math.min(fadingOpacity, 1), 0) +
				')';
			context2d.fillRect(
				0,
				0,
				this.settings.screenWidth,
				this.settings.screenHeight
			);
		}
	};

	/**
	 * Runs a frame, tick and render, clears the screen and keeps track of deltas
	 */
	this.cycle = function() {
		var now = Date.now();

		this.ctxClearScreen();

		this.tick(now - lastFrame);
		this.render(this.context2d);

		lastFrame = now;

		window.requestAnimationFrame(this.cycle.bind(this));
	};

	/**
	 * Start the game
	 */
	this.start = function() {
		window.setTimeout(
			function() {
				if (Art.isReady()) {
					// console.log('game start!', this);

					this.screenNode.focus();

					lastFrame = Date.now();

					window.requestAnimationFrame(this.cycle.bind(this));
				} else {
					this.start();
				}
			}.bind(this),
			10
		);
	};
};

/**
 * The defaultSettings of StateBasedGame
 * @type {Object}
 * @static
 */
StateBasedGame.defaultSettings = {
	screenWidth: 240,
	screenHeight: 160,
	scale: 1,
	pixelated: true,
	font: '14px sans-serif'
};
