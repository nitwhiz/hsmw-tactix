/**
 * A living, moving, attacking and loving unit on the Board
 * @constructor
 * @param {Object} stats - The stats of this unit
 */
var Entity = function(stats) {
	var targetX = 0;
	var targetY = 0;

	var moving = false;
	var walkingPath = false;
	var currentPath = [];

	/**
	 * Holds whether the unit arrived at a potential target
	 * @type {Boolean}
	 * @default false
	 */
	this.arrived = false;

	var currentDirection = Entity.direction.NORTH;
	var currentState = Entity.state.IDLE;

	/**
	 * The UID of this Entity
	 * @type {Number}
	 */
	this.uid = Utils.getUID();

	/**
	 * The stats of this Entity
	 * @type {Object}
	 */
	this.stats = stats;

	for (var i = 0, l = this.stats.inventory.length; i < l; ++i) {
		this.stats.inventory[i].apply(this);
	}

	/**
	 * The vertical position of this entity, in grid units
	 * @type {Number}
	 * @default 0
	 */
	this.gridX = 0;
	/**
	 * The horizontal position of this entity, in grid units
	 * @type {Number}
	 * @default 0
	 */
	this.gridY = 0;

	/**
	 * The vertical position of this entity, in pixels
	 * @type {Number}
	 * @default 0
	 */
	this.screenX = 0;
	/**
	 * The horizontal position of this entity, in pixels
	 * @type {Number}
	 * @default 0
	 */
	this.screenY = 0;

	/**
	 * Used for rendering order
	 * @type {Number}
	 * @default 0
	 */
	this.height = 0;

	/**
	 * Determinates how fast the Entity moves on the Board, e.g. when walking to a target location
	 * @type {Number}
	 * @default 1.93
	 */
	this.speed = 1.93;

	/**
	 * Holds all the Animations for this Entity
	 * @type {Object}
	 * @default {}
	 */
	this.animations = {};

	/**
	 * The DisplayComponent used to show popups or comparable stuff around the Entity
	 * @type {DisplayComponent}
	 * @default null
	 */
	this.popsDisplay = null;

	var animating = true;
	var animationTimer = 0;
	var animatingMagic = false;

	var evadeOX = 0;

	/**
	 * Determinates whether the Entity is rendered blinking
	 * @type {Boolean}
	 * @default false
	 */
	this.isBlinking = false;

	var blinkingDuration = 800;
	var blinkingTimer = blinkingDuration;

	/**
	 * Retrieve whether the point is in the Entities field
	 * @param {Number} gX - The vertical coorinate to check, in grid units
	 * @param {Number} gY - The horizontal coorinate to check, in grid units
	 */
	this.pointInBounds = function(gX, gY) {
		return (
			gX >= this.gridX - 0.5 &&
			gX < this.gridX + 0.5 &&
			gY >= this.gridY - 0.5 &&
			gY < this.gridY + 0.5
		);
	};

	/**
	 * Retrieves the possible walking path
	 * @returns {Array<Array<Number>>|null} null if there is no walking path defined, used for weak checks
	 */
	this.isWalking = function() {
		return walkingPath;
	};

	/**
	 * Set the vertical cooridnate of this Entity
	 * @param {Number} newX - The new vertical coordinate, in grid units
	 */
	this.setX = function(newX) {
		this.setXY(newX, this.gridY);
	};

	/**
	 * Set the horizontal cooridnate of this Entity
	 * @param {Number} newY - The new horizontal coordinate, in grid units
	 */
	this.setY = function(newY) {
		this.setXY(this.gridX, newY);
	};

	/**
	 * Set the location of this Entity
	 * @param {Number} newX - The new vertical coordinate, in grid units
	 * @param {Number} newY - The new horizontal coordinate, in grid units
	 */
	this.setXY = function(newX, newY) {
		this.gridX = newX;
		this.gridY = newY;

		this.screenX = newX * Utils.sin_cos_45 - newY * Utils.sin_cos_45;
		this.screenY = newX * Utils.sin_cos_45 + newY * Utils.sin_cos_45;

		this.screenX = Math.round(this.screenX * Map.tileSize);
		this.screenY = Math.round(this.screenY * Map.tileSize * 0.5);
	};

	/**
	 * Set the looking direction of this Entity
	 * @param {Entity.direction} dir - The new direction
	 */
	this.turn = function(dir) {
		currentDirection = dir;
	};

	/**
	 * Set the looking direction of this Entity by providing an angle
	 * @param {Number} angle - The angle, in degrees
	 */
	this.turnToDirectionByAngle = function(angle) {
		this.turn(Entity.getDirectionByAngle(angle));
	};

	/**
	 * Set the looking direction of this Entity by providing a target field
	 * @param {Number} gridX - The vertical coordinate of the field, in grid units
	 * @param {Number} gridY - The horizontal coordinate of the field, in grid units
	 */
	this.turnToXY = function(gridX, gridY) {
		this.turn(
			Entity.getDirectionByAngle(
				Utils.getAngleDegrees(this.gridX, this.gridY, gridX, gridY)
			)
		);
	};

	/**
	 * Set the looking direction of this Entity by providing an Entity
	 * @param {Entity} entity - The Entity to look at
	 */
	this.turnTo = function(entity) {
		this.turnToXY(entity.gridX, entity.gridY);
	};

	/**
	 * Set the state of this Entity, mainly used for animation
	 * @param {Entity.state} state - The new state
	 */
	this.setState = function(state) {
		currentState = state;
		this.getCurrentAnimation().reset();
	};

	/**
	 * Retrieve the state of this Entity
	 * @returns {Entity.state}
	 */
	this.getState = function() {
		return currentState;
	};

	/**
	 * Retrieve whether this Entity is dead
	 * @returns {Boolean} True if the entity has the `DEAD` state
	 */
	this.isDead = function() {
		return currentState === Entity.state.DEAD;
	};

	/**
	 * Retrieve whether this Entity can attack
	 * @returns {Boolean} True if it can attack
	 */
	this.canAttack = function() {
		if (this.stats.mpLeft - this.stats.attackCost >= 0) {
			return true;
		}

		return false;
	};

	/**
	 * Initiate an attack
	 */
	this.attack = function() {
		this.setState(Entity.state.ATTACKING);

		this.stats.mpLeft -= this.stats.attackCost;

		animating = true;
		animationTimer = 0;
		animatingMagic = this.stats.isMage || false;
	};

	/**
	 * Get attacked by an Entity
	 * @param {Entity} eFrom - The Entity attacking this Entity
	 */
	this.receiveAttack = function(eFrom) {
		var damage = Entity.getDamage(eFrom, this);

		if (!eFrom.stats.isMage) {
			this.turnTo(eFrom);
		}

		if (damage < 0) {
			this.evade();

			this.popsDisplay.floatArtUp(
				Art.miss,
				this.screenX - 12.5,
				this.screenY - 28
			);
		} else {
			this.defend();

			this.popsDisplay.floatTextUp(
				NumberFont.Red,
				damage,
				this.screenX - NumberFont.Red.getWidth(damage) / 2,
				this.screenY - 28
			);

			this.stats.hpLeft = Math.max(this.stats.hpLeft - damage, 0);
		}

		animatingMagic = eFrom.stats.isMage;
	};

	/**
	 * Initiate a try to defend
	 */
	this.defend = function() {
		evadeOX = this.screenX;

		this.setState(Entity.state.DEFENDING);

		animating = true;
		animationTimer = 0;
	};

	/**
	 * Initiate the evading from an attack
	 */
	this.evade = function() {
		evadeOX = this.screenX;

		this.setState(Entity.state.EVADING);

		animating = true;
		animationTimer = 0;
	};

	/**
	 * Retrieve the current Animation of this Entity
	 * @returns {Animation} The current Animation
	 */
	this.getCurrentAnimation = function() {
		return this.animations[currentState + '_' + currentDirection];
	};

	/**
	 * Retrieve the current direction of this Entity
	 * @return {Entity.direction}
	 */
	this.getCurrentDirection = function() {
		return currentDirection;
	};

	/**
	 * Retrieve a direction vector for a specific direction
	 * @param {Entity.direction} dir - The direction
	 * @returns {Object} Containing an x and y key for the direction vector, in grid units
	 */
	this.getDirectionVect = function(dir) {
		var result = {
			x: -1,
			y: -1
		};

		switch (dir) {
			case Entity.direction.NORTH:
				result.x = this.gridX;
				result.y = this.gridY + 1;
				break;
			case Entity.direction.WEST:
				result.x = this.gridX + 1;
				result.y = this.gridY;
				break;
			case Entity.direction.SOUTH:
				result.x = this.gridX;
				result.y = this.gridY - 1;
				break;
			case Entity.direction.EAST:
				result.x = this.gridX - 1;
				result.y = this.gridY;
				break;
			default:
				break;
		}

		return result;
	};

	/**
	 * Initiate the walking along a specific path
	 * @param {Array<Array<Number>>} path - The path to walk along
	 */
	this.walkPath = function(path) {
		walkingPath = true;
		currentPath = path;
		this.arrived = false;
	};

	/**
	 * Initiate the walking to a specific tile
	 * @param {Object} tile - A field containing the x and y coordinates of the field in grid units
	 */
	this.walkTo = function(tile) {
		var targetDirection = null;

		targetX = tile.x;
		targetY = tile.y;

		if (targetX < this.gridX) {
			targetDirection = Entity.direction.EAST;
		} else if (targetX > this.gridX) {
			targetDirection = Entity.direction.WEST;
		} else if (targetY < this.gridY) {
			targetDirection = Entity.direction.SOUTH;
		} else if (targetY > this.gridY) {
			targetDirection = Entity.direction.NORTH;
		}

		this.turn(targetDirection);

		moving = true;
	};

	/**
	 * Initiates a single step into a specific direction
	 * @param {Entity.direction} dir - The direction
	 */
	this.stepDirection = function(dir) {
		var result = this.getDirectionVect(dir);

		if (result.x !== -1 && result.y !== -1) {
			targetX = result.x;
			targetY = result.y;

			this.turn(dir);

			moving = true;
		}
	};

	/**
	 * Retrieve the distance between this Entity and its target field
	 * @returns {Number} The distance in grid units
	 */
	this.getTargetDistance = function() {
		return Math.sqrt(
			Math.pow(this.gridX - targetX, 2) +
				Math.pow(this.gridY - targetY, 2)
		);
	};

	/**
	 * Render this Entity
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.render = function(context2d) {
		if (
			!this.isBlinking ||
			(this.isBlinking && blinkingTimer <= blinkingDuration / 2)
		) {
			this.getCurrentAnimation().render(
				context2d,
				this.screenX - 16,
				this.screenY - 26
			);
		}
	};

	/**
	 * Update this Entity
	 * @param {Number} delta - The delay between the last frame and this frame, in milliseconds
	 */
	this.tick = function(delta) {
		blinkingTimer -= 20;

		if (blinkingTimer <= 0) {
			blinkingTimer = blinkingDuration;
		}

		if (
			this.stats.hpLeft <= 0 &&
			currentState !== Entity.state.DEAD &&
			currentState !== Entity.state.DEFENDING
		) {
			this.setState(Entity.state.DEAD);

			this.popsDisplay.hoverArt(
				Art.stars,
				this.screenX - 7,
				this.screenY - 32
			);
		}

		if (currentState !== Entity.state.DEAD) {
			this.getCurrentAnimation().tick(delta);

			if (animating) {
				// TODO: aka attacking
				animationTimer += delta;

				if (animationTimer >= this.getCurrentAnimation().duration) {
					animating = false;
					animationTimer = 0;

					this.setState(Entity.state.IDLE);
				}
			}

			if (moving) {
				if (this.getTargetDistance() > 0.1) {
					if (this.gridX < targetX) {
						this.setX(this.gridX + delta / 1000 * this.speed);
					} else if (this.gridX > targetX) {
						this.setX(this.gridX - delta / 1000 * this.speed);
					}

					if (this.gridY < targetY) {
						this.setY(this.gridY + delta / 1000 * this.speed);
					} else if (this.gridY > targetY) {
						this.setY(this.gridY - delta / 1000 * this.speed);
					}
				} else {
					moving = false;
				}
			} else if (!moving && walkingPath && currentPath.length > 0) {
				this.setXY(
					Utils.roundPt5(this.gridX),
					Utils.roundPt5(this.gridY)
				);

				this.walkTo(currentPath.shift());
			} else {
				this.setXY(
					Utils.roundPt5(this.gridX),
					Utils.roundPt5(this.gridY)
				);

				if (walkingPath && currentPath.length === 0) {
					walkingPath = false;
					this.arrived = true;
				}
			}

			if (currentState === Entity.state.EVADING) {
				this.screenX =
					evadeOX -
					4 *
						Math.sin(
							animationTimer /
								this.getCurrentAnimation().duration *
								Math.PI
						);
			}
		}
	};
};

/**
 * Default base stats
 * @static
 */
Entity.baseStats = {
	side: -1,
	portrait: null,
	name: 'NULL',
	walkRadius: 1,
	attackRadius: 1,
	attackRange: 0, // how far attacks spread
	weaponAttack: 1,
	weaponDefense: 1,
	magicAttack: 1,
	magicDefense: 1,
	hpLeft: 1,
	hpMax: 1,
	mpLeft: 1,
	mpMax: 1,
	accuracy: 100,
	evasiveness: 100,
	inventory: [],
	isMage: false,
	displayClass: 'Entity',
	displayFont: 'Gold',
	attackCost: 0,
	speed: 0
};

/**
 * Holds the possible inventories for an extension of this class, for demo usage
 * @type {Array}
 * @default []
 */
Entity.demoInventoryPossibilities = [];

/**
 * Retrieve a random individual value
 * @returns {Number} Random floored value between 1 and 15
 */
Entity.randomIV = function() {
	return Math.floor(Math.random() * 15) + 1;
};

/**
 * Create an instance of Entity using an extending BaseClass, applies individual values to the baseStats of these extending classes
 * @param {Function} BaseClass - An extending Class used to create the new instance
 * @param {Boolean} allied - False if this Entity will be AI controlled
 * @returns {BaseClass}
 */
Entity.createInstance = function(BaseClass, allied) {
	var inventory = [];

	for (
		var i = 0, l = BaseClass.demoInventoryPossibilities.length;
		i < l;
		++i
	) {
		if (Math.random() < 0.5 && inventory.length < 3) {
			inventory.push(new BaseClass.demoInventoryPossibilities[i]());
		}
	}

	var stats = Utils.extend(
		Utils.extend(Entity.baseStats, BaseClass.baseStats),
		{
			hpLeft: BaseClass.baseStats.hp + Entity.randomIV(),
			mpLeft: BaseClass.baseStats.mp + Entity.randomIV(),
			weaponAttack: BaseClass.baseStats.weaponAttack + Entity.randomIV(),
			magicAttack: BaseClass.baseStats.magicAttack + Entity.randomIV(),
			accuracy: BaseClass.baseStats.accuracy + Entity.randomIV(),
			evasiveness: BaseClass.baseStats.evasiveness + Entity.randomIV(),
			speed: BaseClass.baseStats.speed + Entity.randomIV(),
			inventory: inventory
		}
	);

	stats.hpMax = stats.hpLeft;
	stats.mpMax = stats.mpLeft;

	stats.name = Entity.pullRandomName();

	if (allied) {
		stats.side = Entity.ALLIED;
	} else {
		stats.side = Entity.ENEMY;
	}

	return new BaseClass(stats);
};

/**
 * Enumeration for allied Entities
 * @static
 */
Entity.ALLIED = 0;
/**
 * Enumeration for enemy Entities
 * @static
 */
Entity.ENEMY = 1;

/**
 * Enumeration for states of Entities
 * @enum
 * @type {String}
 */
Entity.state = {
	/** Doing nothing */
	IDLE: 'idle',
	/** Attacking */
	ATTACKING: 'attacking',
	/** Defending */
	DEFENDING: 'defending',
	/** Evading */
	EVADING: 'evading',
	/** Dead */
	DEAD: 'dead'
};

/**
 * Enumeration for directions of Entities
 * @enum
 * @type {String}
 */
Entity.direction = {
	/** North */
	NORTH: 'north',
	/** West */
	WEST: 'west',
	/** South */
	SOUTH: 'south',
	/** East */
	EAST: 'east'
};

/**
 * Retrieve the direction of an specific angle
 * @param {Number} angle - The angle, in degrees
 * @returns {Entity.direction}
 */
Entity.getDirectionByAngle = function(angle) {
	angle += 45;

	if (angle > 360) {
		angle -= 360;
	}

	angle -= angle % 90;

	switch (angle) {
		case 0:
			return Entity.direction.EAST;
		case 90:
			return Entity.direction.SOUTH;
		case 180:
			return Entity.direction.WEST;
		case 270:
			return Entity.direction.NORTH;
		default:
			return Entity.direction.SOUTH;
	}
};

/**
 * Retrieve the position modifier used in damage calculation
 * @param {Entity} attacker - The attacking Entity
 * @param {Entity} defender - The defending Entity
 * @returns {Number}
 */
Entity.getPositionModifier = function(attacker, defender) {
	var pos = 0.5;

	if (attacker.getCurrentDirection() === defender.getCurrentDirection()) {
		pos = 1.5;
	} else if (
		!(
			(attacker.getCurrentDirection() === Entity.direction.NORTH &&
				defender.getCurrentDirection() === Entity.direction.SOUTH) ||
			(attacker.getCurrentDirection() === Entity.direction.SOUTH &&
				defender.getCurrentDirection() === Entity.direction.NORTH) ||
			(attacker.getCurrentDirection() === Entity.direction.WEST &&
				defender.getCurrentDirection() === Entity.direction.EAST) ||
			(attacker.getCurrentDirection() === Entity.direction.EAST &&
				defender.getCurrentDirection() === Entity.direction.WEST)
		)
	) {
		pos = 1;
	}

	return pos;
};

/**
 * Retrieve whether the attack will hit
 * @param {Entity} attacker - The attacking Entity
 * @param {Entity} defender - The defending Entity
 * @returns {Boolean} True if it hits
 */
Entity.willHit = function(attacker, defender) {
	var p =
		Entity.getPositionModifier(attacker, defender) *
		(attacker.stats.accuracy / attacker.stats.evasiveness);

	return p >= Math.random();
};

/**
 * Retrieve the damage an attacker will deal an defender.
 * The formula used is `D = attack / defense * 5 * mod`, where
 * `mod = pos * crit * rand`, where `pos` is decided by the constellation of attacker and defender,
 * `crit` is 2 if it is a critical hit and `rand` is a random number between 0.85 and 1 (inclusive)
 * @param {Entity} attacker - The attacking Entity
 * @param {Entity} defender - The defending Entity
 * @returns {Number} -1 if the attack missed, any other Number otherwise
 */
Entity.getDamage = function(attacker, defender) {
	// miss
	if (!Entity.willHit(attacker, defender)) {
		return -1;
	}

	var attack = attacker.stats.isMage
		? attacker.stats.magicAttack
		: attacker.stats.weaponAttack;
	var defense = attacker.stats.isMage
		? defender.stats.magicDefense
		: defender.stats.weaponDefense;
	var pos = Entity.getPositionModifier(attacker, defender);
	var critThreshold = attacker.stats.accuracy / 2;
	var crit = Math.random() * 100 < critThreshold ? 2 : 1;
	var rand = Math.random() * 0.15 + 0.85;
	var mod = pos * crit * rand;

	var damage = attack / defense * 5 * mod;

	//console.log(attack, defense, pos, crit, rand, mod, damage);

	return Math.max(Math.floor(damage), 1);
};

/**
 * Retrieve a random direction
 * @returns {Entity.direction}
 */
Entity.getRandomDirection = function() {
	return [
		Entity.direction.NORTH,
		Entity.direction.WEST,
		Entity.direction.SOUTH,
		Entity.direction.EAST
	][Math.floor(Math.random() * 4)];
};

/**
 * Collection of random names used to name Entities
 * @static
 */
Entity.randomNames = [
	'Alcest',
	'Anry',
	'Anton',
	'Arthur',
	'Augusto',
	'Azimov',
	'Baldwin',
	'Basil',
	'Bellini',
	'Benkman',
	'Bensom',
	'Benton',
	'Bernardo',
	'Bingley',
	'Bismark',
	'Bjorn',
	'Brean',
	'Brish',
	'Brown',
	'Brunhart',
	'Caines',
	'Camus',
	'Carlos',
	'Carrelo',
	'Carson',
	'Cassidy',
	'Cesare',
	'Chad',
	'Chandler',
	'Chaka',
	'Chaucer',
	'Chelney',
	'Chibot',
	'Chita',
	'Clay',
	'Cliffor',
	'Cochran',
	'Conner',
	'Conrad',
	'Cooper',
	'Cox',
	'Crout',
	'Crowe',
	'Cuthbert',
	'Darcy',
	'Darios',
	'Darren',
	'Dave',
	'David',
	'Deen',
	'Deisel',
	'Deiter',
	'Devange',
	'Devoe',
	'Dickens',
	'Dino',
	'Domenic',
	'Domie',
	'Douglas',
	'Duler',
	'Dwight',
	'Dylan',
	'Edmund',
	'Elias',
	'Elija',
	'Elmon',
	'Elnan',
	'Elvos',
	'Emet',
	'Eugene',
	'Euver',
	'Evor',
	'Finnagan',
	'Foobar',
	'Ford',
	'Frantz',
	'Gallahan',
	'Galor',
	'Gavvar',
	'Gelarto',
	'Georg',
	'Gerome',
	'Giger',
	'Gilbert',
	'Gillis',
	'Godfrey',
	'Goodwin',
	'Gotwald',
	'Graham',
	'Grandi',
	'Guin',
	'Gustav',
	'Hans',
	'Hardy',
	'Hastings',
	'Heath',
	'Higgins',
	'Hodges',
	'Homer',
	'Hoffman',
	'Holbin',
	'Hopper',
	'Hores',
	'Ichbod',
	'Iden',
	'Ingg',
	'Isaac',
	'Istavan',
	'Ivolt',
	'Jalam',
	'Jang',
	'Jareth',
	'Javet',
	'Juris',
	'Jon',
	'Jonathan',
	'Johanes',
	'Joseph',
	'Joshua',
	'Julian',
	'Karl',
	'Kemal',
	'Kenneth',
	'Kent',
	'Kestner',
	'Kief',
	'Kilov',
	'Kingsley',
	'Kipper',
	'Larga',
	'Lendle',
	'Lenny',
	'Leo',
	'Leonard',
	'Leroy',
	'Lex',
	'Lester',
	'Lezaford',
	'Liam',
	'Lidenbok',
	'Lief',
	'Lizzo',
	'Loki',
	'Looie',
	'Lorek',
	'Luan',
	'Lucas',
	'Lukino',
	'Lunais',
	'Macgregor',
	'Mack',
	'Mackenroe',
	'Major',
	'Malchelo',
	'Marius',
	'Martinez',
	'Marty',
	'Matias',
	'Mauritz',
	'Meiyou',
	'Melanor',
	'Mendoza',
	'Messara',
	'Michael',
	'Michaelov',
	'Mick',
	'Milay',
	'Miles',
	'Milton',
	'Moby',
	'Mondo',
	'Monid',
	'Monte',
	'Moritz',
	'Morry',
	'Mosley',
	'Muglio',
	'Mujika',
	'Mulat',
	'Nabkov',
	'Nansen',
	'Nat',
	'Nate',
	'Neddy',
	'Neksu',
	'Nelin',
	'Nelson',
	'Nero',
	'Neuman',
	'Nevil',
	'Nikolai',
	'Nils',
	'Nobel',
	'Noman',
	'Nol',
	'Norbert',
	'Nothclif',
	'Nume',
	'Nusratt',
	'Ocon',
	'Odonel',
	'Oigen',
	'Olgan',
	'Olint',
	'Olivar',
	'Orsiny',
	'Oskar',
	'Pablo',
	'Parish',
	'Pedro',
	'Peet',
	'Phil',
	'Raif',
	'Rain',
	'Ramses',
	'Ramsey',
	'Ranbard',
	'Randorf',
	'Raol',
	'Ravel',
	'Rayton',
	'Ricardo',
	'Rickman',
	'Ridley',
	'Rober',
	'Rodrigo',
	'Rolan',
	'Roland',
	'Rolf',
	'Rockwell',
	'Roker',
	'Rooster',
	'Sabatini',
	'Safra',
	'Sale',
	'Salsbar',
	'Sammy',
	'Sandath',
	'Satir',
	'Schneider',
	'Seleucos',
	'Selm',
	'Seneka',
	'Seth',
	'Sharu',
	'Shudmeyer',
	'Shultz',
	'Sigmund',
	'Silac',
	'Simon',
	'Skimble',
	'Slamen',
	'Smyth',
	'Soala',
	'Sotel',
	'Spengler',
	'Stan',
	'Stanz',
	'Staring',
	'Stuart',
	'Syrus',
	'Tavana',
	'Tennesey',
	'Thane',
	'Thedoric',
	'Thenardi',
	'Theodore',
	'Thomson',
	'Thorton',
	'Timothy',
	'Toby',
	'Tonio',
	'Tony',
	'Toynbee',
	'Travis',
	'Trevor',
	'Turner',
	'Udvil',
	'Vasil',
	'Velasquez',
	'Victor',
	'Visconti',
	'Wagner',
	'Watoo',
	'Watz',
	'Wells',
	'Werner',
	'Wilder',
	'Wilfred',
	'Willy',
	'Woolwort',
	'Yenke',
	'Yolando',
	'Yuri',
	'Yutolio',
	'Yuwain',
	'Zeeman',
	'Zenelly',
	'Zoik',
	'Zwingley'
];

/**
 * Retrieve a random name and remove it from the list of possible names
 * @returns {String}
 */
Entity.pullRandomName = function() {
	return (
		Entity.randomNames.splice(
			Math.floor(Math.random() * Entity.randomNames.length),
			1
		)[0] || 'NO NAME LEFT'
	);
};
