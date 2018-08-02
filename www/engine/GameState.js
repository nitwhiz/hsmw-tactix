/**
 * Holds initialisation, tick, render and events of a scenery
 * @constructor
 * @param {StateBasedGame} game - The game holding this GameState
 */
var GameState = function(game) {
	/**
	 * The game holding this GameState
	 * @type {StateBasedGame}
	 */
	this.game = game;

	/**
	 * Initialize the GameState
	 * @abstract
	 */
	this.init = function() {};

	/**
	 * Tick the GameState
	 * @abstract
	 */
	this.tick = function() {};

	/**
	 * Render the GameState
	 * @abstract
	 */
	this.render = function() {};

	/**
	 * Event handler for mouse clicked
	 * @abstract
	 */
	this.onMouseClick = function() {};

	/**
	 * Event handler for mouse key down
	 * @abstract
	 */
	this.onMouseDown = function() {};

	/**
	 * Event handler for mouse key up
	 * @abstract
	 */
	this.onMouseUp = function() {};

	/**
	 * Event handler for mouse moved
	 * @abstract
	 */
	this.onMouseMove = function() {};

	/**
	 * Event handler for key down
	 * @abstract
	 */
	this.onKeyDown = function() {};

	/**
	 * Event handler for key up
	 * @abstract
	 */
	this.onKeyUp = function() {};
};
