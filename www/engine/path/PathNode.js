/**
 * PathNodes for A* path finding
 * @constructor
 * @param {Number} x - The vertical coordinate
 * @param {Number} y - The horizontal coordinate
 * @param {Number} f - The initial f cost
 * @param {Number} g - The initial g cost
 */
var PathNode = function(x, y, f, g) {
	/**
	 * The vertical coordinate
	 * @type {Number}
	 */
	this.x = x;
	/**
	 * The horizontal coordinate
	 * @type {Number}
	 */
	this.y = y;

	/**
	 * The f cost
	 * @type {Number}
	 */
	this.f = f || 0;
	/**
	 * The g cost
	 * @type {Number}
	 */
	this.g = g || 0;

	/**
	 * A hash representing this node
	 * @type {String}
	 */
	this.hash = 'PathNode@' + x + ',' + y;

	/**
	 * The predecessor of this node
	 * @type {PathNode}
	 */
	this.predecessor = null;

	/**
	 * The successors of this node
	 * @type {Array<PathNode>}
	 */
	this.successors = [];

	/**
	 * Discovers and validates the 4 successors around this node
	 * @param {AStar} aStar - An AStar instance
	 * @returns {Array<PathNode>} The valid successors
	 */
	this.discoverSuccessors = function(aStar) {
		for (
			var i = 0, l = PathNode.successorVects.length, vect = null;
			i < l;
			++i
		) {
			vect = PathNode.successorVects[i];

			if (!aStar.isInvalid(this.x + vect.dX, this.y + vect.dY)) {
				this.successors.push(
					new PathNode(this.x + vect.dX, this.y + vect.dY)
				);
			}
		}
	};
};

/**
 * The vectors representing where successor fields are found
 * @static
 * @type {Array<Object>}
 */
PathNode.successorVects = [
	{ dX: -1, dY: 0 },
	{ dX: 0, dY: -1 },
	{ dX: 1, dY: 0 },
	{ dX: 0, dY: 1 }
];
