/**
 * Demo Chestplate
 * @constructor
 * @extends {Item}
 */
var Chestplate = function() {
	Item.call(this);

	this.name = 'Chestplate';
	this.icon = Art.itemChestplate;

	this.boostText = '+3 WDEF';

	this.boost.weaponDefense = 3;
};

Chestplate.prototype = Object.create(Item.prototype);
