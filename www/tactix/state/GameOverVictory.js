/**
 * This state is displayed when the player won the game
 * @constructor
 * @param {StateBasedGame} game - The game to associate the state with
 * @extends {GameState}
 */
var GameOverVictory = function(game) {
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

		Font.Gold.renderString(context2d, 'VICTORY!', 4, 5);
	};
};

GameOverVictory.prototype = Object.create(GameState.prototype);
