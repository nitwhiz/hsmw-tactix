/**
 * Demo Wand
 * @constructor
 * @extends {Item}
 */
var Wand = function() {
	Item.call(this);

	this.name = 'Wand';
	this.icon = Art.itemWand;

	this.boostText = '+10 MATK/MP +1 AC';

	this.boost.magicAttack = 10;
	this.boost.mpLeft = 10;
	this.boost.mpMax = 10;

	this.boost.attackCost = 1;
};

Wand.prototype = Object.create(Item.prototype);
