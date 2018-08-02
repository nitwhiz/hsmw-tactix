/**
 * DisplayComponent for summary of the stats of an Entity
 * @constructor
 * @extends {DisplayComponent}
 */
var Stats = function(renderSide) {
	DisplayComponent.call(this);

	var entity = null;

	var side = Entity.ALLIED;

	var portrait = null;

	var name = 'Jackson';

	var hpLeft = 0;
	var hpMax = 0;

	var mpLeft = 0;
	var mpMax = 0;

	var artBackground = null;

	var nameX = 0;
	var nameY = 2;

	var hpX = 0;
	var hpY = 16;

	var mpX = 0;
	var mpY = 27;

	if (renderSide === 0) {
		artBackground = Art.statsBackgroundLeft;

		nameX = 30;
		hpX = 50;
		mpX = 50;
	} else {
		artBackground = Art.statsBackgroundRight;

		nameX = 12;
		hpX = 32;
		mpX = 32;
	}

	var fetchValues = function() {
		if (entity !== null) {
			side = entity.stats.side;
			portrait = entity.stats.portrait;
			name = entity.stats.name;
			hpLeft = entity.stats.hpLeft;
			hpMax = entity.stats.hpMax;
			mpLeft = entity.stats.mpLeft;
			mpMax = entity.stats.mpMax;
		}
	};

	/**
	 * Set the Entity whose stats are rendered
	 * @param {Entity} e - The Entity
	 */
	this.setEntity = function(e) {
		entity = e;
		fetchValues();
	};

	/**
	 * Retrieve the Entity whose stats are rendered
	 * @returns {Entity}
	 */
	this.getEntity = function() {
		return entity;
	};

	/**
	 * Update the DisplayComponent
	 * @override
	 * @param {Number} delta - The delay between the last frame and this frame
	 */
	this.tick = function(delta) {
		fetchValues();
	};

	/**
	 * Render the GameState
	 * @override
	 * @param {CanvasRenderingContext2D} context2d - The context to render this frame in
	 */
	this.render = function(context2d) {
		if (entity !== null) {
			artBackground[side].render(context2d, 0, 0);

			Font.White.renderString(context2d, name, nameX, nameY);

			NumberFont.White.renderString(
				context2d,
				hpLeft + '/' + hpMax,
				hpX,
				hpY
			);
			NumberFont.White.renderString(
				context2d,
				mpLeft + '/' + mpMax,
				mpX,
				mpY
			);

			if (renderSide === 0) {
				portrait.render(context2d, -15, -55);
			}
		}
	};
};

Stats.prototype = Object.create(DisplayComponent.prototype);
