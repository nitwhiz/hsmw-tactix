/**
 * Aisenfield map, used in demo
 * @constructor
 * @extends {Map}
 */
var Aisenfield = function() {
	Map.call(this, Art.mapAisenfieldLayer, Art.mapAisenfieldBackground, 240, 2);

	this.addSolid(new Solid(2, 3, Art.mapSolidRock));
	this.addSolid(new Solid(5, 1, Art.mapSolidRock));
	this.addSolid(new Solid(13, 9, Art.mapSolidRock));
	this.addSolid(new Solid(7, 6, Art.mapSolidRock));
	this.addSolid(new Solid(10, 13, Art.mapSolidRock));

	this.gridWidth = 14;
	this.gridHeight = 14;
};

Aisenfield.prototype = Object.create(Map.prototype);
