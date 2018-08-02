/**
 * Holds the visual representation of the Map
 * @constructor
 * @param {Art} artMap - The texture of this Map
 * @param {Art} artBackground - The texture of the background
 * @param {Number} zeroX - The vertical shift of the zero point in the texture
 * @param {Number} zeroY - The horizontal shift of the zero point in the texture
 */
var Map = function(artMap, artBackground, zeroX, zeroY) {
	var solids = [];

	/**
	 * The width of this Map in grid units
	 * @type {Number}
	 * @default 20
	 */
	this.gridWidth = 20;
	/**
	 * The height of this Map in grid units
	 * @type {Number}
	 * @default 20
	 */
	this.gridHeight = 20;

	/**
	 * The vertical shift of the zero point in the texture (inverted)
	 * @type {Number}
	 */
	this.translateX = -zeroX;
	/**
	 * The horizontal shift of the zero point in the texture (inverted)
	 * @type {Number}
	 */
	this.translateY = -zeroY;

	/**
	 * Renders the background of this Map
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.renderBackground = function(context2d) {
		artBackground.render(context2d, 0, 0);
	};

	/**
	 * Renders the texture of this map
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.renderMap = function(context2d) {
		artMap.render(context2d, this.translateX, this.translateY);
	};

	/**
	 * Retrieves all added Solids of this Map
	 * @returns {Array<Solid>}
	 */
	this.getSolids = function() {
		return solids;
	};

	/**
	 * Adds a Solid to this map
	 * @param {Solid} solid - The solid to add
	 */
	this.addSolid = function(solid) {
		solids.push(solid);
	};

	/**
	 * Executes a callback for every Solid of this Map
	 * @param {Function} callback - The callback
	 */
	this.eachSolid = function(callback) {
		for (var i = 0, l = solids.length; i < l; ++i) {
			callback(solids[i]);
		}
	};

	/**
	 * Retrieves whether a field is Solid
	 * @param {Number} x - The vertical coordinate to check, in grid units
	 * @param {Number} y - The horizontal coordinate to check, in grid units
	 * @returns {Boolean}
	 */
	this.isSolid = function(x, y) {
		var solid = false;

		solids.forEach(function(s) {
			if (s.x <= x && s.y <= y && s.x + 1 > x && s.y + 1 > y) {
				solid = true;
			}
		});

		return solid;
	};

	/**
	 * Retrieves whether a field is not in this Map
	 * @param {Number} x - The vertical coordinate to check, in grid units
	 * @param {Number} y - The horizontal coordinate to check, in grid units
	 * @returns {Boolean}
	 */
	this.isOutOfBounds = function(x, y) {
		return x < 0 || y < 0 || x > this.gridWidth || y > this.gridHeight;
	};
};

/**
 * The tile size of Maps
 * @static
 * @type {Number}
 * @default 24
 */
Map.tileSize = 24;
