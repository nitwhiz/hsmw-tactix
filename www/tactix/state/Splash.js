/**
 * This state is displayed on startup
 * @constructor
 * @param {StateBasedGame} game - The game to associate the state with
 * @extends {GameState}
 */
var Splash = function(game) {
	GameState.call(this, game);

	var text = 'CLICK TO START';

	var timer = 0;
	var renderText = true;

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
	this.tick = function(delta) {
		timer += delta;

		if (timer >= 500) {
			renderText = !renderText;
			timer = 0;
		}

		if (game.mouseKeyPressed(0)) {
			game.switchState('howto');
		}
	};

	/**
	 * Render the GameState
	 * @override
	 * @param {CanvasRenderingContext2D} context2d - The context to render this frame in
	 */
	this.render = function(context2d) {
		Art.splash.render(context2d, 0, 0);

		if (renderText) {
			Font.Gold.renderString(
				context2d,
				text,
				120 - Font.Gold.getWidth(text) / 2,
				100
			);
		}
	};
};

Splash.prototype = Object.create(GameState.prototype);
