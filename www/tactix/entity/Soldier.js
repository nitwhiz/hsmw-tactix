/**
 * A Soldier
 * @constructor
 * @extends {Entity}
 */
var Soldier = function(stats) {
	Entity.call(this, stats);

	if (this.stats.side === Entity.ALLIED) {
		this.stats.portrait = Art.portraitSoldierAllied;

		this.animations = {
			idle_north: Animation.soldierIdleNorth.instance(),
			idle_west: Animation.soldierIdleWest.instance(),
			idle_south: Animation.soldierIdleSouth.instance(),
			idle_east: Animation.soldierIdleEast.instance(),

			attacking_north: Animation.soldierAttackingNorth.instance(),
			attacking_west: Animation.soldierAttackingWest.instance(),
			attacking_south: Animation.soldierAttackingSouth.instance(),
			attacking_east: Animation.soldierAttackingEast.instance(),

			defending_north: Animation.soldierDefendingNorth.instance(),
			defending_west: Animation.soldierDefendingWest.instance(),
			defending_south: Animation.soldierDefendingSouth.instance(),
			defending_east: Animation.soldierDefendingEast.instance(),

			evading_north: Animation.soldierEvadingNorth.instance(),
			evading_west: Animation.soldierEvadingWest.instance(),
			evading_south: Animation.soldierEvadingSouth.instance(),
			evading_east: Animation.soldierEvadingEast.instance(),

			dead_north: Animation.soldierDeadNorth.instance(),
			dead_west: Animation.soldierDeadWest.instance(),
			dead_south: Animation.soldierDeadSouth.instance(),
			dead_east: Animation.soldierDeadEast.instance()
		};
	} else {
		this.stats.portrait = Art.portraitSoldierEnemy;

		this.animations = {
			idle_north: Animation.enemySoldierIdleNorth.instance(),
			idle_west: Animation.enemySoldierIdleWest.instance(),
			idle_south: Animation.enemySoldierIdleSouth.instance(),
			idle_east: Animation.enemySoldierIdleEast.instance(),

			attacking_north: Animation.enemySoldierAttackingNorth.instance(),
			attacking_west: Animation.enemySoldierAttackingWest.instance(),
			attacking_south: Animation.enemySoldierAttackingSouth.instance(),
			attacking_east: Animation.enemySoldierAttackingEast.instance(),

			defending_north: Animation.enemySoldierDefendingNorth.instance(),
			defending_west: Animation.enemySoldierDefendingWest.instance(),
			defending_south: Animation.enemySoldierDefendingSouth.instance(),
			defending_east: Animation.enemySoldierDefendingEast.instance(),

			evading_north: Animation.enemySoldierEvadingNorth.instance(),
			evading_west: Animation.enemySoldierEvadingWest.instance(),
			evading_south: Animation.enemySoldierEvadingSouth.instance(),
			evading_east: Animation.enemySoldierEvadingEast.instance(),

			dead_north: Animation.enemySoldierDeadNorth.instance(),
			dead_west: Animation.enemySoldierDeadWest.instance(),
			dead_south: Animation.enemySoldierDeadSouth.instance(),
			dead_east: Animation.enemySoldierDeadEast.instance()
		};
	}
};

Soldier.prototype = Object.create(Entity.prototype);

Soldier.baseStats = {
	hp: 80,
	mp: 10,
	weaponAttack: 7,
	weaponDefense: 8,
	magicAttack: 2,
	magicDefense: 3,
	accuracy: 80,
	evasiveness: 70,
	walkRadius: 3,
	attackRadius: 1,
	speed: 30,
	displayClass: 'Soldier',
	displayFont: 'Yellow'
};

Soldier.demoInventoryPossibilities = [Sword, Chestplate, Shield, Boots];
