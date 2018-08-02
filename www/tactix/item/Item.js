/**
 * Holds data about an Item
 * @constructor
 */
var Item = function() {
	/**
	 * The name of this Item
	 * @type {String}
	 * @default Item
	 */
	this.name = 'Item';

	/**
	 * The text to display in the inventory
	 * @type {String}
	 * @default N/A
	 */
	this.boostText = 'N/A';
	/**
	 * The icon to display in the inventory
	 * @type {String}
	 * @default Item
	 */
	this.icon = null;

	/**
	 * The properties of this item
	 */
	this.boost = {
		hpLeft: 0,
		hpMax: 0,
		mpLeft: 0,
		mpMax: 0,
		walkRadius: 0,
		attackRadius: 0,
		attackRange: 0,
		attackCost: 0,
		weaponAttack: 0,
		weaponDefense: 0,
		magicAttack: 0,
		magicDefense: 0
	};

	/**
	 * Apply the boosts to an Entity
	 * @param {Entity} entity - The Entity
	 */
	this.apply = function(entity) {
		for (var stat in this.boost) {
			if (this.boost.hasOwnProperty(stat)) {
				entity.stats[stat] += this.boost[stat];
			}
		}
	};
};
