/**
 * Holds methods and data for NPC controlling
 * @namespace
 */
var AI = {
	/**
	 * Enumeration for walking
	 * @readonly
	 * @type {Number}
	 */
	WALK: 0,
	/**
	 * Enumeration for attacking
	 * @readonly
	 * @type {Number}
	 */
	ATTACK: 1,
	/**
	 * Enumeration for waiting
	 * @readonly
	 * @type {Number}
	 */
	WAIT: 2,
	/**
	 * Holds known fields with walkable Entities
	 * @type {Array<Array<Number>>}
	 */
	knownWalkableEntities: [],
	/**
	 * Holds known fields with attackable Entities
	 * @type {Array<Array<Number>>}
	 */
	knownAttackableEntities: [],
	/**
	 * Holds known walkable fields
	 * @type {Array<Array<Number>>}
	 */
	knownWalkableFields: [],
	/**
	 * Factory for a decision object
	 * @param {Number} decision - A decision to put into this object
	 * @param {Entity.direction} direction - A direction for this decision
	 * @param {Number} targetX - A target vertical coordinate
	 * @param {Number} targetY - A target horizontal coordinate
	 * @returns {Object}
	 */
	decide: function(decision, direction, targetX, targetY) {
		return {
			decision: decision,
			direction: direction,
			targetX: targetX,
			targetY: targetY
		};
	},
	/**
	 * Decide to walk to a random Entity
	 * @returns {Object}
	 */
	decideWalkToRandomEntity: function() {
		var randomTarget =
			AI.knownWalkableEntities[
				Math.floor(Math.random() * AI.knownWalkableEntities.length)
			];

		return AI.decide(AI.WALK, null, randomTarget[0], randomTarget[1]);
	},
	/**
	 * Decide to attack to an Entity
	 * @param {Array<Number>} field - x, y to attack
	 * @returns {Object}
	 */
	decideAttackEntity: function(field) {
		return AI.decide(AI.ATTACK, null, field[0], field[1]);
	},
	/**
	 * Decide to attack to a random Entity
	 * @returns {Object}
	 */
	decideAttackRandomEntity: function() {
		var randomTarget =
			AI.knownAttackableEntities[
				Math.floor(Math.random() * AI.knownAttackableEntities.length)
			];

		return AI.decide(AI.ATTACK, null, randomTarget[0], randomTarget[1]);
	},
	/**
	 * Decide to walk to a random field
	 * @returns {Object}
	 */
	decideWalkToRandomField: function() {
		var randomTarget =
			AI.knownWalkableFields[
				Math.floor(Math.random() * AI.knownWalkableFields.length)
			];

		return AI.decide(AI.WALK, null, randomTarget[0], randomTarget[1]);
	},
	/**
	 * Decide to wait in a direction
	 * @param {Entity.direction} direction - A direction
	 * @returns {Object}
	 */
	decideWait: function(direction) {
		return AI.decide(AI.WAIT, direction, null, null);
	},
	/**
	 * Evaluate an AI action
	 * @param {Board} board - The Board to orientate on
	 * @param {Entity} entity - The Entity to decide for
	 * @param {Boolean} didWalk - True if the Entity did already walk
	 * @param {Boolean} didAttack - True if the Entity did already attack
	 * @returns {Object}
	 */
	makeDecision: function(board, entity, didWalk, didAttack) {
		AI.knownWalkableFields = Explorer.discoverWalkables(entity);

		AI.knownWalkableEntities = Explorer.discoverWalkables(
			entity
		).filter(function(field) {
			var found = [
				board.getEntityAtXY(field[0] - 1, field[1]),
				board.getEntityAtXY(field[0] + 1, field[1]),
				board.getEntityAtXY(field[0], field[1] - 1),
				board.getEntityAtXY(field[0], field[1] + 1)
			];

			for (var i = 0; i < 4; ++i) {
				if (found[i] === null) {
					continue;
				}

				if (
					found[i].stats.side !== entity.stats.side &&
					found[i].stats.hpLeft > 0
				) {
					return true;
				}
			}

			return false;
		});

		AI.knownAttackableEntities = Explorer.discoverAttackables(
			entity
		).filter(function(field) {
			var oE = board.getEntityAtXY(field[0], field[1]);

			return (
				oE !== null &&
				oE.stats.side !== entity.stats.side &&
				oE.stats.hpLeft > 0
			);
		});

		var aliveOpposideEntities = board.getEntities(
			'side',
			entity.stats.side === Entity.ALLIED ? Entity.ENEMY : Entity.ALLIED
		);

		var aliveEntities = board.getAllEntities();

		var waitAndLook = function() {
			var minDistance =
				(board.map.gridWidth + 1) * (board.map.gridHeight + 1);
			var direction = Entity.direction.SOUTH;

			if (Math.random() < 0.8) {
				for (var i = 0, l = aliveOpposideEntities.length; i < l; ++i) {
					var dist = Utils.getDistance2(
						entity.gridX,
						entity.gridY,
						aliveOpposideEntities[i].gridX,
						aliveOpposideEntities[i].gridY
					);

					if (dist < minDistance) {
						minDistance = dist;

						var eX = entity.gridX;
						var eY = entity.gridY;
						var oX = aliveOpposideEntities[i].gridX;
						var oY = aliveOpposideEntities[i].gridY;

						direction = Entity.getDirectionByAngle(
							Utils.getAngleDegrees(
								entity.gridX,
								entity.gridY,
								aliveOpposideEntities[i].gridX,
								aliveOpposideEntities[i].gridY
							)
						);
					}
				}
			} else {
				direction = Entity.getRandomDirection();
			}

			return AI.decideWait(direction);
		};

		var countEntitiesInRadiusAround = function(radius2, gridX, gridY) {
			var countEnemies = 0;
			var countAllies = 0;
			var checked = {};

			for (var i = 0, l = aliveEntities.length; i < l; ++i) {
				if (
					Utils.getDistance2(
						gridX,
						gridY,
						aliveEntities[i].gridX,
						aliveEntities[i].gridY
					) <= radius2 &&
					checked[aliveEntities[i].uid] === undefined
				) {
					if (aliveEntities[i].stats.side === entity.stats.side) {
						++countAllies;
					} else {
						++countEnemies;
					}

					checked[aliveEntities[i].uid] = true;
				}
			}

			var count = countEnemies - countAllies;

			if (
				countEnemies === 0 ||
				count < 0 ||
				(count === 0 && Math.random() < 0.5)
			) {
				count = 0;
			}

			return count;
		};

		var evalAttacking = function() {
			if (didAttack) {
				return evalMoving();
			} else {
				if (entity.stats.attackRange > 0) {
					var range2 =
						entity.stats.attackRange * entity.stats.attackRange;

					var maxAffectedCount = 0;
					var maxAffectedField = null;

					for (
						var i = 0, l = AI.knownAttackableEntities.length;
						i < l;
						++i
					) {
						var affected = countEntitiesInRadiusAround(
							range2,
							AI.knownAttackableEntities[i][0],
							AI.knownAttackableEntities[i][1]
						);

						if (affected > maxAffectedCount) {
							maxAffectedCount = affected;
							maxAffectedField = AI.knownAttackableEntities[i];
						}
					}

					if (maxAffectedField !== null) {
						return AI.decideAttackEntity(maxAffectedField);
					} else {
						return evalMoving();
					}
				} else {
					if (AI.knownAttackableEntities.length > 0) {
						return AI.decideAttackRandomEntity();
					} else {
						return evalMoving();
					}
				}
			}
		};

		var evalMoving = function() {
			if (!didWalk) {
				if (entity.stats.attackRange > 0) {
					if (AI.knownWalkableFields.length > 0) {
						return AI.decideWalkToRandomField();
					}
				} else {
					if (
						entity.stats.hpLeft > entity.stats.hpMax * 0.5 ||
						Math.random() < 0.3
					) {
						if (Math.random() < 0.3) {
							if (AI.knownWalkableFields.length > 0) {
								return AI.decideWalkToRandomField();
							}
						} else {
							if (AI.knownWalkableEntities.length > 0) {
								return AI.decideWalkToRandomEntity();
							}
						}
					}

					if (AI.knownWalkableFields.length > 0) {
						return AI.decideWalkToRandomField();
					}
				}
			}

			return waitAndLook();
		};

		// entry to AI
		return evalAttacking();
	}
};
