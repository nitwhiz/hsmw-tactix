/**
 * Much like a boardgames board, this Board holds all Entities, the Map and provides orientation in itself.
 * Specialised for 2 classes of Entities: Mage and Soldier
 * @constructor
 * @param {Map} map - A Map to initialise the Board with
 */
var Board = function(map) {
	var display = new Display();
	var popsDisplay = new Pops();

	display.addComponent(popsDisplay);

	var entities = {};

	/**
	 * The vertical coordinate of the current center
	 * @type {Number}
	 * @default 0
	 */
	this.centerX = 0;
	/**
	 * The vertical coordinate of the current center
	 * @type {Number}
	 * @default 120
	 */
	this.centerY = 120;

	var eachEntity = function(callback) {
		for (var entity in entities) {
			if (entities.hasOwnProperty(entity)) {
				if (callback(entities[entity]) === false) {
					break;
				}
			}
		}
	};

	var pointedField = null;

	/**
	 * The Map associated with this board
	 * @type {Map}
	 */
	this.map = map;

	var translateX = 0;
	var translateY = 0;

	var walkables = [];
	var attackables = [];

	/**
	 * Get/Set whether the walkable fields for the current Entity should be rendered
	 * @type {Boolean}
	 * @default false
	 */
	this.showWalkables = false;
	/**
	 * Get/Set whether the attackable fields for the current Entity should be rendered
	 * @type {Boolean}
	 * @default false
	 */
	this.showAttackables = false;

	// round management

	var entityOrder = [];

	var currentEntity = 0;

	var animationPlaying = null;
	var animationPlayingDuration = 0;
	var animationPlayingScreenX = 0;
	var animationPlayingScreenY = 0;

	/**
	 * Start playing an Animation
	 * @param {Animation} animation - The Animation
	 * @param {Number} duration - Specifies how long the Animation is displayed, in milliseconds
	 * @param {Number} screenX - Define the vertical coordinate where to render this Animation, in pixels
	 * @param {Number} screenY - Define the horizontal coordinate where to render this Animation, in pixels
	 */
	this.playAnimation = function(animation, duration, screenX, screenY) {
		animationPlaying = animation;
		animationPlayingDuration = duration;

		animationPlayingScreenX = screenX;
		animationPlayingScreenY = screenY;
	};

	/**
	 * Stop playing the attack animation for mages
	 */
	this.stopAnimation = function() {
		animationPlaying = null;
	};

	/**
	 * Attack a specific field on the board
	 * @param {Entity} attacker - An Entity which executes the attack
	 * @param {Number} gridX - The vertical corrdinate of the field that'll be attacked, in grid units
	 * @param {Number} gridY - The horizontal corrdinate of the field that'll be attacked, in grid units
	 */
	this.attackXY = function(attacker, gridX, gridY) {
		attacker.turnToXY(gridX, gridY);

		if (attacker.stats.isMage) {
			var screen = {
				x:
					Math.floor(
						((gridX - 0.5) * Utils.sin_cos_45 -
							(gridY + 0.5) * Utils.sin_cos_45) *
							Map.tileSize
					) + 1,
				y:
					Math.floor(
						((gridX - 0.5) * Utils.sin_cos_45 +
							(gridY + 0.5) * Utils.sin_cos_45) *
							Map.tileSize *
							0.5
					) + 1
			};

			this.playAnimation(Animation.thunder, 720, screen.x, screen.y);
		}
	};

	/**
	 * Set the pointer to a specific position
	 * @param {Number} x - The vertical coordinate, in grid units
	 * @param {Number} y - The horizontal coordinate, in grid units
	 */
	this.pointAt = function(x, y) {
		pointedField = {
			gridX: x,
			gridY: y,
			screenX:
				Math.floor(
					((x - 0.5) * Utils.sin_cos_45 -
						(y + 0.5) * Utils.sin_cos_45) *
						Map.tileSize
				) + 1,
			screenY:
				Math.floor(
					((x - 0.5) * Utils.sin_cos_45 +
						(y + 0.5) * Utils.sin_cos_45) *
						Map.tileSize *
						0.5
				) + 1,
			arrowTop: pointedField ? pointedField.arrowTop : 0,
			arrowTimer: pointedField ? pointedField.arrowTimer : 0
		};
	};

	/**
	 * Remove the pointer
	 */
	this.unPoint = function() {
		pointedField = null;
	};

	/**
	 * Stop blinking of all Entities
	 */
	this.unBlink = function() {
		eachEntity(function(entity) {
			entity.isBlinking = false;
		});
	};

	/**
	 * Retrieve all Entities, filtered by their stats
	 * @param {String} filterStatProp - The property to look at for filtering
	 * @param {Object} filterStatVal - The value to check for filtering
	 * @returns {Array<Entity>} All Entities with the condition `e.stats[filterStatProp] === filterStatVal` being true
	 */
	this.getEntities = function(filterStatProp, filterStatVal) {
		var result = [];

		eachEntity(function(e) {
			if (!e.isDead() && e.stats[filterStatProp] === filterStatVal) {
				result.push(e);
			}
		});

		return result;
	};

	/**
	 * Retrieve all Entities
	 * @returns {Array<Entity>}
	 */
	this.getAllEntities = function() {
		var result = [];

		eachEntity(function(e) {
			result.push(e);
		});

		return result;
	};

	/**
	 * Retrieve an Entity at position x, y
	 * @param {Number} gridX - The vertical coorinate to check, in grid units
	 * @param {Number} gridY - The horizontal coorinate to check, in grid units
	 * @returns {Entity} The entity at x, y or null if there is none
	 */
	this.getEntityAtXY = function(gridX, gridY) {
		var result = null;

		eachEntity(function(e) {
			if (
				gridX >= e.gridX - 0.5 &&
				gridX < e.gridX + 0.5 &&
				gridY >= e.gridY - 0.5 &&
				gridY < e.gridY + 0.5
			) {
				result = e;

				return false;
			}
		});

		return result;
	};

	/**
	 * Retrieve an Entity by it's UID
	 * @param {Number} uid - The UID to search for
	 * @returns {Entity} The Entity or null if there is no Entity with the specified UID
	 */
	this.getEntityByUID = function(uid) {
		return entities[uid] || null;
	};

	/**
	 * Retrieve the current Entity
	 * @returns {Entity} The Entity or null if there is no current Entity
	 */
	this.getCurrentEntity = function() {
		return entities[entityOrder[currentEntity]] || null;
	};

	/**
	 * Retrieve whether one of the teams is defeated
	 * @returns {Boolean} True if there is no defeated team
	 */
	this.canGoOn = function() {
		var enemiesAlive = 0;
		var alliesAlive = 0;

		eachEntity(function(entity) {
			if (entity.stats.hpLeft > 0) {
				if (entity.stats.side === Entity.ENEMY) {
					++enemiesAlive;
				} else {
					++alliesAlive;
				}
			}
		});

		return enemiesAlive && alliesAlive;
	};

	/**
	 * Retrieve count of enemies alive on this Board
	 * @returns {Number}
	 */
	this.getEnemyCount = function() {
		var c = 0;

		eachEntity(function(entity) {
			if (entity.stats.hpLeft > 0) {
				if (entity.stats.side === Entity.ENEMY) {
					++c;
				}
			}
		});

		return c;
	};

	/**
	 * Retrieve count of allies alive on this Board
	 * @returns {Number}
	 */
	this.getAllyCount = function() {
		var c = 0;

		eachEntity(function(entity) {
			if (entity.stats.hpLeft > 0) {
				if (entity.stats.side === Entity.ALLIED) {
					++c;
				}
			}
		});

		return c;
	};

	/**
	 * Cycle the current Entity to the next one, skips dead units
	 * @returns {Boolean} True if there was an Entity to cycle to
	 */
	this.cycleNextEntity = function() {
		if (!this.canGoOn()) {
			return false;
		}

		if (++currentEntity === entityOrder.length) {
			currentEntity = 0;
		}

		if (entities[entityOrder[currentEntity]].stats.hpLeft <= 0) {
			this.cycleNextEntity();
		}

		return true;
	};

	/**
	 * Create and place an Entity
	 * @param {Function} BaseClass - The Class used to instantiate the Entity
	 * @param {Boolean} allied - False if this is a AI controlled Entity
	 */
	this.spawnEntity = function(BaseClass, allied) {
		var e = Entity.createInstance(BaseClass, allied);

		// console.log('SPAWN', e.stats);

		this.addEntity(e, true);
	};

	/**
	 * Places en Entity on this Board, adds an UID to it
	 * @param {Entity} entity - The Entity to add
	 * @param {Boolean} distribute - True if the entity should be placed at a random, free x, y tile on the Board
	 */
	this.addEntity = function(entity, distribute) {
		var uid = Utils.getUID();

		entity.uid = uid;
		entity.popsDisplay = popsDisplay;

		entities[uid] = entity;

		entityOrder.push(uid);

		entityOrder.sort(function(e1, e2) {
			return entities[e2].stats.speed - entities[e1].stats.speed;
		});

		if (distribute) {
			var distX = -1;
			var distY = -1;

			while (
				distX === -1 ||
				distY === -1 ||
				this.isEntity(distX, distY) ||
				this.map.isSolid(distX, distY)
			) {
				distX = Math.floor(Math.random() * map.gridWidth) + 0.5;
				distY = Math.floor(Math.random() * map.gridHeight) + 0.5;
			}

			entity.setXY(distX, distY);
			entity.turn(Entity.getRandomDirection());
		}
	};

	/**
	 * Sets the center of this Board to the Entity
	 * @param {Entity} entity - The Entity to center this Board on
	 */
	this.centerOnEntity = function(entity) {
		this.centerX = entity.screenX;
		this.centerY = entity.screenY;
	};

	/**
	 * Sets the center of this Board to a specific x, y tile on this Board
	 * @param {Number} x - The vertical coordinate to center on, in grid units
	 * @param {Number} y - The horizontal coordinate to center on, in grid units
	 */
	this.centerOnGridXY = function(x, y) {
		var screen = this.toScreenXY(x, y);

		centerX = Math.floor(screen.x);
		centerY = Math.floor(screen.y);
	};

	/**
	 * Retrieve all fields with Entities on them
	 * @returns {Array<Array<Number>>} An Array with the fields, may be empty
	 */
	this.getFieldsWithEntites = function() {
		var fields = [];

		eachEntity(function(entity) {
			fields.push({
				x: Math.floor(entity.gridX),
				y: Math.floor(entity.gridY)
			});
		});

		return fields;
	};

	/**
	 * Retrieve wheather there is an Entity on this field
	 * @param {Number} gridX - The vertical coordinate to check, in grid units
	 * @param {Number} gridY - The vertical coordinate to check, in grid units
	 * @returns {Entity|Boolean} Either the Entity if there is any or explicitly false if there is none
	 */
	this.isEntity = function(gridX, gridY) {
		var result = false;

		eachEntity(function(e) {
			if (
				gridX >= e.gridX - 0.5 &&
				gridX < e.gridX + 0.5 &&
				gridY >= e.gridY - 0.5 &&
				gridY < e.gridY + 0.5
			) {
				result = true;
				return false;
			}
		});

		return result;
	};

	/**
	 * Retrieve wheather there is an alive Entity on this field
	 * @param {Number} gridX - The vertical coordinate to check, in grid units
	 * @param {Number} gridY - The vertical coordinate to check, in grid units
	 * @returns {Boolean} True if there is an alive Entity on this field
	 */
	this.isAliveEntity = function(gridX, gridY) {
		var e = null;

		return (e = this.getEntityAtXY(gridX, gridY)) !== null && !e.isDead();
	};

	/**
	 * Retrieve whether a specified field is walkable
	 * @param {Number} gridX - The vertical coorinate to check, in grid units
	 * @param {Number} gridY - The horizontal cooridnate to check, in grid units
	 * @returns {Boolean} True if the field is walkable
	 */
	this.isWalkable = function(gridX, gridY) {
		for (var i = 0, l = walkables.length; i < l; ++i) {
			if (
				walkables[i][0] - 0.5 <= gridX &&
				walkables[i][0] + 0.5 > gridX &&
				walkables[i][1] - 0.5 <= gridY &&
				walkables[i][1] + 0.5 > gridY
			) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Retrieve whether a specified field is attackable
	 * @param {Number} gridX - The vertical coorinate to check, in grid units
	 * @param {Number} gridY - The horizontal cooridnate to check, in grid units
	 * @returns {Boolean} True if the field is attackable
	 */
	this.isAttackable = function(gridX, gridY) {
		for (var i = 0, l = attackables.length; i < l; ++i) {
			if (
				attackables[i][0] - 0.5 <= gridX &&
				attackables[i][0] + 0.5 > gridX &&
				attackables[i][1] - 0.5 <= gridY &&
				attackables[i][1] + 0.5 > gridY
			) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Discover walkables and attackables for a specified Entity, clears Explorer cache beforehand
	 * @param {Number} eid - The UID of the Entity to discover the fields for
	 */
	this.entityDiscover = function(eid) {
		//PerformanceCounter.currentColor = 'rgba(0, 0, 255, .9)';

		Explorer.clearCache();

		walkables = Explorer.discoverWalkables(entities[eid]);
		attackables = Explorer.discoverAttackables(entities[eid]);
	};

	/**
	 * Retrieve the walkables
	 * @returns {Array<Array<Number>>}
	 */
	this.getWalkables = function() {
		return walkables;
	};

	/**
	 * Retrieve the attackables
	 * @returns {Array<Array<Number>>}
	 */
	this.getAttackables = function() {
		return attackables;
	};

	/**
	 * Update this Board
	 * @param {Number} delta - The delay between the last frame and this frame, in milliseconds
	 */
	this.tick = function(delta) {
		eachEntity(function(entity) {
			entity.tick(delta);
		});

		Animation.boardWalkableFieldsEnemy.tick(delta);
		Animation.boardWalkableFieldsAllied.tick(delta);
		Animation.boardWalkableFieldsImportant.tick(delta);
		Animation.boardWalkableFieldsNeutral.tick(delta);

		if (pointedField) {
			pointedField.arrowTop = Math.sin(pointedField.arrowTimer / 175) * 6;

			pointedField.arrowTimer += delta;
		}

		if (animationPlaying) {
			animationPlaying.tick(delta);
			animationPlayingDuration -= delta;

			if (animationPlayingDuration <= 0) {
				this.stopAnimation();
			}
		}

		display.tick(delta);
	};

	/**
	 * Helper for rendering, sorts entities and solids in Y order
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.renderEntitiesAndSolids = function(context2d) {
		var renderTable = [];

		eachEntity(function(entity) {
			renderTable.push(entity);
		});

		this.map.eachSolid(function(solid) {
			renderTable.push(solid);
		});

		renderTable.sort(function(a, b) {
			return a.screenY + a.height - (b.screenY + b.height);
		});

		for (var i = 0, l = renderTable.length; i < l; ++i) {
			renderTable[i].render(context2d);
		}
	};

	/**
	 * Render an Animation on a set of fields
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 * @param {Animation} animation - The Animation to render
	 * @param {Array<Array<Number>>} fields - The fields to render the Animation at
	 */
	this.highlightFields = function(context2d, animation, fields) {
		for (var i = 0, l = fields.length; i < l; ++i) {
			var sX =
				(fields[i][0] - 1) * Utils.sin_cos_45 -
				fields[i][1] * Utils.sin_cos_45;
			var sY =
				(fields[i][0] - 1) * Utils.sin_cos_45 +
				fields[i][1] * Utils.sin_cos_45;

			sX = Math.floor(sX * Map.tileSize);
			sY = Math.floor(sY * Map.tileSize * 0.5);

			animation.render(context2d, sX, sY);
		}
	};

	/**
	 * Render the Board
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.render = function(context2d) {
		this.map.renderBackground(context2d);

		translateX = context2d.canvas.width / 2 - this.centerX;
		translateY = context2d.canvas.height / 2 - this.centerY;

		context2d.translate(translateX, translateY);

		this.map.renderMap(context2d);

		if (this.showWalkables) {
			this.highlightFields(
				context2d,
				this.getCurrentEntity().stats.side === Entity.ENEMY
					? Animation.boardWalkableFieldsEnemy
					: Animation.boardWalkableFieldsAllied,
				walkables
			);
		} else if (this.showAttackables) {
			this.highlightFields(
				context2d,
				Animation.boardWalkableFieldsNeutral,
				attackables
			);
		}

		if (this.getCurrentEntity() && !this.getCurrentEntity().isWalking()) {
			Animation.boardWalkableFieldsImportant.render(
				context2d,
				this.getCurrentEntity().screenX - 17,
				this.getCurrentEntity().screenY - 9
			);
		}

		if (pointedField) {
			Art.boardPointerField.render(
				context2d,
				pointedField.screenX,
				pointedField.screenY
			);
		}

		this.renderEntitiesAndSolids(context2d);

		if (pointedField) {
			Art.boardPointerArrow.render(
				context2d,
				pointedField.screenX + 12,
				pointedField.screenY - 8 - 36 + pointedField.arrowTop
			);
		}

		if (animationPlaying) {
			animationPlaying.render(
				context2d,
				animationPlayingScreenX - 150 + 17,
				animationPlayingScreenY - 300
			);
		}

		display.render(context2d);

		context2d.resetTransform();
	};

	/**
	 * Calculate the grid coordinates for specified screen coordinates
	 * @param {Number} screenX - The vertical coordinate to convert, in pixels
	 * @param {Number} screenY - The horizontal coordinate to convert, in pixels
	 * @returns {Object} An Object containing an x and y key for the grid coordinates
	 */
	this.toGridXY = function(screenX, screenY) {
		screenX -= translateX;
		screenY -= translateY;

		var gridX = screenX / Map.tileSize;
		var gridY = screenY / Map.tileSize / 0.5;

		return {
			x: -(gridX * -Utils.sin_cos_45 + gridY * -Utils.sin_cos_45),
			y: gridX * -Utils.sin_cos_45 - gridY * -Utils.sin_cos_45
		};
	};

	/**
	 * Calculate the screen coordinates for specified grid coordinates
	 * @param {Number} gridX - The vertical coordinate to convert, in grid units
	 * @param {Number} gridY - The horizontal coordinate to convert, in grid units
	 * @returns {Object} An Object containing an x and y key for the screen coordinates
	 */
	this.toScreenXY = function(gridX, gridY) {
		var screenX = gridX * Utils.sin_cos_45 - gridY * Utils.sin_cos_45;
		var screenY = gridX * Utils.sin_cos_45 + gridY * Utils.sin_cos_45;

		return {
			x: Math.floor(screenX * Map.tileSize),
			y: Math.floor(screenX * Map.tileSize * 0.5)
		};
	};
};
