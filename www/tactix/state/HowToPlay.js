/**
 * This state is displayed after splash, shows some basic instructions
 * @constructor
 * @param {StateBasedGame} game - The game to associate the state with
 * @extends {GameState}
 */
var HowToPlay = function(game) {
	GameState.call(this, game);

	/**
	 * Initialize the GameState
	 * @override
	 */
	this.init = function() {};

	/**
	 * Update the GameState
	 * @override
	 * @param {Number} delta - The delay between the last frame and this frame
	 */
	this.tick = function(delta) {};

	/**
	 * Render the GameState
	 * @override
	 * @param {CanvasRenderingContext2D} context2d - The context to render this frame in
	 */
	this.render = function(context2d) {
		Art.howto.render(context2d, 0, 0);

		Font.White.renderString(context2d, 'HOW TO PLAY', 4, 5);

		Font.White.renderString(context2d, 'Press Q to move', 4, 20);
		Font.White.renderString(context2d, 'Press W to wait', 4, 32);
		Font.White.renderString(context2d, 'Press E to attack', 4, 44);
		Font.White.renderString(context2d, 'You can move and attack', 4, 56);
		Font.White.renderString(context2d, 'once per round.', 4, 68);

		Font.Gold.renderString(context2d, 'CLICK TO CONTINUE', 4, 144);

		if (game.mouseKeyPressed(0)) {
			game.switchState('game');
		}
	};
};

HowToPlay.prototype = Object.create(GameState.prototype);
