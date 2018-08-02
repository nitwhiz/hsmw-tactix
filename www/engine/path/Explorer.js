/**
 * A collection of functions to discover entities.
 * Caches results for better performance
 * @namespace
 */
var Explorer = {
	/**
	 * The board to explore
	 * @type {Board}
	 * @default null
	 */
	board: null,
	/**
	 * The cache
	 * @type {Object}
	 */
	cache: {},
	/**
	 * Clear the cache
	 */
	clearCache: function() {
		if (Explorer.cache !== {}) {
			Explorer.cache = {};
		}
	},
	/**
	 * Pass something through the cache.
	 * @param {String} id - The identifier used in cache
	 * @param {Function} callbackFunc - The callback to call when there is nothing cached under the given id. Will be bound to Explorer context
	 * @param {Array} callbackArgs - Arguments for the callback, will be applied via Function.apply
	 * @returns {Object} The cached result if there is any, else it'll call callback(...callbackArgs), cache it's return value and return it
	 */
	passThruCache: function(id, callbackFunc, callbackArgs) {
		if (Explorer.cache[id]) {
			PerformanceCounter.currentColor = 'rgba(0, 0, 255, .9)';
			return Explorer.cache[id];
		}

		return (Explorer.cache[id] = callbackFunc.apply(
			Explorer,
			callbackArgs
		));
	},
	/**
	 * Retrieve whether the field P(x, y) is in fields
	 * @param {Number} x - Vertical coordinate to check
	 * @param {Number} y - Horizontal coordinate to check
	 * @param {Array<Array<Number>>} fields - The Array of fields to go through
	 */
	foundField: function(x, y, fields) {
		for (var i = 0, l = fields.length; i < l; ++i) {
			if (fields[i][0] === x && fields[i][1] === y) {
				return true;
			}
		}

		return false;
	},
	/**
	 * Retrieve whether the fields have a valid A* path between them.
	 * @param {Number} gX - The vertical starting coordinate, in grid units
	 * @param {Number} gY - The horizontal starting coordinate, in grid units
	 * @param {Number} x - The vertical goal coordinate, in grid units
	 * @param {Number} y - The horizontal goal coordinate, in grid units
	 * @param {Boolean} entitiesValid - True if fields with Entities should count as walkable
	 * @returns {(Array|Boolean)} The path if there is one, explicitly false if not
	 */
	isValidField: function(gX, gY, x, y, entitiesValid) {
		if (x === gX && y === gY) {
			return false;
		}

		var path = new AStar(
			Explorer.board,
			gX,
			gY,
			x,
			y,
			entitiesValid
		).findPath();

		return path.length > 0 ? path : false;
	},
	/**
	 * Discover all valid fields in a specific radius around an Entity
	 * @param {Entity} entity - The entity
	 * @param {Number} radius - The radius, in grid units
	 * @param {Boolean} entitiesValid - Whether Entities should be walkable
	 * @returns {Array<Array<Number>>} - The discovered, valid fields - This won't be cached
	 */
	discoverFields: function(entity, radius, entitiesValid) {
		var fields = [];
		var r2 = radius * radius;

		var gX = entity.gridX;
		var gY = entity.gridY;

		var foundPath = false;

		for (var x = gX - radius; x <= gX + radius; ++x) {
			for (var y = gY - radius; y <= gY + radius; ++y) {
				if (
					Utils.getDistance2(gX, gY, x, y) <= r2 &&
					!Explorer.foundField(x, y, fields)
				) {
					foundPath = Explorer.isValidField(
						gX,
						gY,
						x,
						y,
						entitiesValid
					);

					if (foundPath === false || foundPath.length === 0) {
						continue;
					}

					for (var i = 0, l = foundPath.length; i < l; ++i) {
						if (
							!Explorer.foundField(
								foundPath[i].x,
								foundPath[i].y,
								fields
							)
						) {
							fields.push([foundPath[i].x, foundPath[i].y]);
						}
					}
				}
			}
		}

		return fields;
	},
	/**
	 * Discover all fields in Entitys walkRadius without fields with Entities on them
	 * @param {Entity} entity - The entity
	 * @returns {Array<Array<Number>>} - The discovered, valid fields - This will be cached
	 */
	discoverWalkables: function(entity) {
		return Explorer.passThruCache('walkables', Explorer.discoverFields, [
			entity,
			entity.stats.walkRadius,
			false
		]);
	},
	/**
	 * Discover all fields in Entitys attackRadius with fields with Entities on them
	 * @param {Entity} entity - The entity
	 * @returns {Array<Array<Number>>} - The discovered, valid fields - This will be cached
	 */
	discoverAttackables: function(entity) {
		return Explorer.passThruCache('attackables', Explorer.discoverFields, [
			entity,
			entity.stats.attackRadius,
			true
		]);
	},
	/**
	 * Discover all fields with Entitys in radius around a specified field
	 * @param {Number} gridX - The vertical coordinate of the field, in grid units
	 * @param {Number} gridY - The horizontal coordinate of the field, in grid units
	 * @param {Number} radius - The radius to check, in grid units
	 * @returns {Array<Array<Number>>} - The discovered, valid fields - This will be cached
	 */
	discoverEntitiesInRadius: function(gridX, gridY, radius) {
		return Explorer.passThruCache(
			'entitiesInRadius@' + gridX + ',' + gridY + '/' + radius,
			function(gridX, gridY, radius) {
				var entities = [];
				var r2 = radius * radius;

				var e = null;

				for (var x = gridX - radius; x <= gridX + radius; ++x) {
					for (var y = gridY - radius; y <= gridY + radius; ++y) {
						e = Explorer.board.getEntityAtXY(x, y);

						if (
							e !== null &&
							!e.isDead() &&
							Utils.getDistance2(gridX, gridY, x, y) <= r2
						) {
							entities.push(e);
						}
					}
				}

				return entities;
			},
			[gridX, gridY, radius]
		);
	}
};
