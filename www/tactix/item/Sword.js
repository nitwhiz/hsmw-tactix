/**
 * Demo Sword
 * @constructor
 * @extends {Item}
 */
var Sword = function() {
	Item.call(this);

	this.name = 'Sword';
	this.icon = Art.itemSword;

	this.boostText = '+5 WATK';

	this.boost.weaponAttack = 5;
};

Sword.prototype = Object.create(Item.prototype);
