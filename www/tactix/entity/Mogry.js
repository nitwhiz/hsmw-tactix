/**
 * A Mogry
 * @constructor
 * @extends {Entity}
 */
var Mogry = function(stats) {
	Entity.call(this, stats);

	if (this.stats.side === Entity.ALLIED) {
		this.stats.portrait = Art.portraitMogryAllied;

		this.animations = {
			idle_north: Animation.mogryIdleNorth.instance(),
			idle_west: Animation.mogryIdleWest.instance(),
			idle_south: Animation.mogryIdleSouth.instance(),
			idle_east: Animation.mogryIdleEast.instance(),

			attacking_north: Animation.mogryAttackingNorth.instance(),
			attacking_west: Animation.mogryAttackingWest.instance(),
			attacking_south: Animation.mogryAttackingSouth.instance(),
			attacking_east: Animation.mogryAttackingEast.instance(),

			defending_north: Animation.mogryDefendingNorth.instance(),
			defending_west: Animation.mogryDefendingWest.instance(),
			defending_south: Animation.mogryDefendingSouth.instance(),
			defending_east: Animation.mogryDefendingEast.instance(),

			evading_north: Animation.mogryEvadingNorth.instance(),
			evading_west: Animation.mogryEvadingWest.instance(),
			evading_south: Animation.mogryEvadingSouth.instance(),
			evading_east: Animation.mogryEvadingEast.instance(),

			dead_north: Animation.mogryDeadNorth.instance(),
			dead_west: Animation.mogryDeadWest.instance(),
			dead_south: Animation.mogryDeadSouth.instance(),
			dead_east: Animation.mogryDeadEast.instance()
		};
	} else {
		this.stats.portrait = Art.portraitMogryEnemy;

		this.animations = {
			idle_north: Animation.enemyMogryIdleNorth.instance(),
			idle_west: Animation.enemyMogryIdleWest.instance(),
			idle_south: Animation.enemyMogryIdleSouth.instance(),
			idle_east: Animation.enemyMogryIdleEast.instance(),

			attacking_north: Animation.enemyMogryAttackingNorth.instance(),
			attacking_west: Animation.enemyMogryAttackingWest.instance(),
			attacking_south: Animation.enemyMogryAttackingSouth.instance(),
			attacking_east: Animation.enemyMogryAttackingEast.instance(),

			defending_north: Animation.enemyMogryDefendingNorth.instance(),
			defending_west: Animation.enemyMogryDefendingWest.instance(),
			defending_south: Animation.enemyMogryDefendingSouth.instance(),
			defending_east: Animation.enemyMogryDefendingEast.instance(),

			evading_north: Animation.enemyMogryEvadingNorth.instance(),
			evading_west: Animation.enemyMogryEvadingWest.instance(),
			evading_south: Animation.enemyMogryEvadingSouth.instance(),
			evading_east: Animation.enemyMogryEvadingEast.instance(),

			dead_north: Animation.enemyMogryDeadNorth.instance(),
			dead_west: Animation.enemyMogryDeadWest.instance(),
			dead_south: Animation.enemyMogryDeadSouth.instance(),
			dead_east: Animation.enemyMogryDeadEast.instance()
		};
	}
};

Mogry.prototype = Object.create(Entity.prototype);

Mogry.baseStats = {
	hp: 60,
	mp: 50,
	weaponAttack: 2,
	weaponDefense: 3,
	magicAttack: 6,
	magicDefense: 7,
	accuracy: 60,
	evasiveness: 50,
	walkRadius: 2,
	attackRadius: 4,
	attackCost: 2,
	attackRange: 1,
	isMage: true,
	speed: 20,
	displayClass: 'Mogry',
	displayFont: 'Violet'
};

Mogry.demoInventoryPossibilities = [Wand, Chestplate, Shield, Boots];
