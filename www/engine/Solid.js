/**
 * Declares a solid, uninteractable entity on the map
 * @constructor
 * @param {Number} x - Vertical position of the Solid, in grid coordinates
 * @param {Number} y - Horizontal position of the Solid, in grid coordinates
 * @param {Art} art - The texture of this Solid
 */
var Solid = function(x, y, art) {
	/**
	 * Vertical position of the Solid, in grid coordinates
	 * @type {Number}
	 */
	this.x = x;
	/**
	 * Horizontal position of the Solid, in grid coordinates
	 * @type {Number}
	 */
	this.y = y;
	/**
	 * The texture of this Solid
	 * @type {Art}
	 */
	this.art = art;

	/**
	 * Height of this Solid, used for layering when rendering
	 * @type {Number}
	 * @default 24
	 */
	this.height = 24;

	/**
	 * Vertical position of the Solid, in screen coordinates
	 * @type {Number}
	 */
	this.screenX = this.x * Utils.sin_cos_45 - this.y * Utils.sin_cos_45;
	/**
	 * Horizontal position of the Solid, in screen coordinates
	 * @type {Number}
	 */
	this.screenY = this.x * Utils.sin_cos_45 + this.y * Utils.sin_cos_45;

	this.screenX = Math.floor(this.screenX * Map.tileSize) - 12;
	this.screenY = Math.floor(this.screenY * Map.tileSize * 0.5) - 12;

	/**
	 * Renders this Solid
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.render = function(context2d) {
		this.art.render(context2d, this.screenX, this.screenY);
	};
};
