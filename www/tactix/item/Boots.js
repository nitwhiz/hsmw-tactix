/**
 * Demo Boots
 * @constructor
 * @extends {Item}
 */
var Boots = function() {
	Item.call(this);

	this.name = 'Boots';
	this.icon = Art.itemBoots;

	this.boostText = '+1 WR';

	this.boost.walkRadius = 1;
};

Boots.prototype = Object.create(Item.prototype);
