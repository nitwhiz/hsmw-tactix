/**
 * Demo Shield
 * @constructor
 * @extends {Item}
 */
var Shield = function() {
	Item.call(this);

	this.name = 'Shield';
	this.icon = Art.itemShield;

	this.boostText = '+5 WDEF';

	this.boost.weaponDefense = 5;
};

Shield.prototype = Object.create(Item.prototype);
