/**
 * Main class for game. Holds a StateBasedGame, adds States and manages display.
 * Initializes StateBasedGame on instantiation for Tactix game.
 * Can be seen as a wrapper for our StateBasedGame
 * @constructor
 * @param {HTMLCanvasElement} screenNode - The canvas to associate the game with
 * @param {Object} settings - The settings
 */
var Tactix = function(screenNode, settings) {
	var game = new StateBasedGame(screenNode, settings);

	game.addState('splash', new Splash(game));
	game.addState('howto', new HowToPlay(game));
	game.addState('game', new InGame(game));

	game.addState('go_victory', new GameOverVictory(game));
	game.addState('go_defeat', new GameOverDefeat(game));

	Cursor.add('default', 'assets/cursor/pointer.png');

	Cursor.add('translate', 'assets/cursor/translate.png');

	Cursor.add('wait_north', 'assets/cursor/wait_north.png');
	Cursor.add('wait_west', 'assets/cursor/wait_west.png');
	Cursor.add('wait_south', 'assets/cursor/wait_south.png');
	Cursor.add('wait_east', 'assets/cursor/wait_east.png');

	Cursor.set('default', game.screenNode);

	game.init();

	var resizer = function() {
		game.setScale(
			Math.min(
				window.innerWidth / game.settings.screenWidth,
				window.innerHeight / game.settings.screenHeight
			)
		);
	};

	window.addEventListener('resize', resizer);

	resizer();

	/**
	 * Starts the game
	 */
	this.run = function() {
		game.start();
	};
};
