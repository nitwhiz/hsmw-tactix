/**
 * Class for A* path finding
 * @constructor
 * @param {Board} board - A board holding all Entities and the Map
 * @param {Number} startX - The vertical starting coordinate, in grid units
 * @param {Number} startY - The horizontal starting coordinate, in grid units
 * @param {Number} targetX - The vertical goal coordinate, in grid units
 * @param {Number} targetY - The horizontal goal coordinate, in grid units
 * @param {Boolean} entitiesValid - True if fields with Entities should count as walkable
 */
var AStar = function(board, startX, startY, targetX, targetY, entitiesValid) {
	/**
	 * Holds all invalid fields in the moment of instantiation
	 * @type {Array<Array<Number>>}
	 */
	this.invalidFields = Utils.merge(
		!entitiesValid ? board.getFieldsWithEntites() : [],
		board.map.getSolids()
	);

	/**
	 * Retrieve whether the field is listed as invalidFields
	 * @param {Number} x - The vertical coordinate to check, in grid units
	 * @param {Number} y - The horizontal coordinate to check, in grid units
	 * @returns {Boolean}
	 */
	this.isInvalid = function(x, y) {
		if (
			x < 0 ||
			y < 0 ||
			x >= board.map.gridWidth ||
			y >= board.map.gridHeight
		) {
			return true;
		}

		for (var i = 0, l = this.invalidFields.length; i < l; ++i) {
			if (
				x >= this.invalidFields[i].x &&
				x < this.invalidFields[i].x + 1 &&
				y >= this.invalidFields[i].y &&
				y < this.invalidFields[i].y + 1
			) {
				return true;
			}
		}

		return false;
	};

	var targetNode = new PathNode(targetX, targetY);

	var openList = new PriorityQueue();
	var closedList = {};

	closedList.add = function(pathNode) {
		closedList[pathNode.hash] = pathNode;
	};

	closedList.contains = function(pathNode) {
		return closedList[pathNode.hash] !== undefined;
	};

	openList.insert(new PathNode(startX, startY), 0);

	var h = function(x, y) {
		return Math.abs(x - targetX) + Math.abs(y - targetY);
	};

	var expandNode = function(pathNode) {
		pathNode.discoverSuccessors(this);

		for (
			var i = 0, l = pathNode.successors.length, successor = null;
			i < l;
			++i
		) {
			successor = pathNode.successors[i];

			if (closedList.contains(successor)) {
				continue;
			}

			var tG = pathNode.g + 1;

			if (
				openList.contains(successor) &&
				tG >= openList.get(successor).g
			) {
				continue;
			}

			successor.predecessor = pathNode;
			successor.g = tG;

			var f = tG + h(successor.x, successor.y);

			if (openList.contains(successor)) {
				openList.decreaseKey(successor, f);
			} else {
				openList.insert(successor, f);
			}
		}
	}.bind(this);

	/**
	 * Retrieve a valid path from A(startX, startY) to P(targetX, targetY) without cutting corners.
	 * @returns {Array<Array<Number>>} An empty Array if there is no path
	 */
	this.findPath = function() {
		PerformanceCounter.currentColor = 'rgba(255, 0, 0, .9)';

		if (this.isInvalid(targetX, targetY)) {
			return [];
		}

		do {
			var currentNode = openList.removeMin();

			if (currentNode.hash === targetNode.hash) {
				var path = [];

				do {
					path.unshift(currentNode);

					currentNode = currentNode.predecessor;
				} while (currentNode.predecessor !== null);

				return path;
			}

			closedList.add(currentNode);

			expandNode(currentNode);
		} while (openList.size() > 0);

		return [];
	};
};
