/**
 * Displays the inventory of an Entity
 * @constructor
 */
var InventoryDisplay = function() {
	var currentEntity = null;
	var isVisible = false;

	/**
	 * Toggle this Display visible
	 */
	this.show = function() {
		isVisible = true;
	};

	/**
	 * Toggle this Display invisible
	 */
	this.hide = function() {
		isVisible = false;
	};

	/**
	 * Retrieve the visibility
	 * @returns {Boolean}
	 */
	this.isVisible = function() {
		return isVisible;
	};

	/**
	 * Set the Entity whose stats will be rendered
	 */
	this.setEntity = function(entity) {
		currentEntity = entity;
	};

	/**
	 * Render the GameState
	 * @param {CanvasRenderingContext2D} context2d - The context to render this frame in
	 */
	this.render = function(context2d) {
		if (isVisible && currentEntity !== null) {
			// general + portrait
			Art.inventoryLayer2.render(context2d, 0, 0);
			currentEntity.stats.portrait.render(context2d, 0, -35);
			Art.inventoryLayer1.render(context2d, 0, 0);

			// name + class
			Font.White.renderString(context2d, currentEntity.stats.name, 47, 4);
			Font[currentEntity.stats.displayFont].renderString(
				context2d,
				currentEntity.stats.displayClass,
				47,
				17
			);

			// hp + mp
			NumberFont.White.renderString(
				context2d,
				currentEntity.stats.hpLeft + '/' + currentEntity.stats.hpMax,
				66,
				31
			);
			NumberFont.White.renderString(
				context2d,
				currentEntity.stats.mpLeft + '/' + currentEntity.stats.mpMax,
				66,
				42
			);

			// move + evade
			NumberFont.White.renderString(
				context2d,
				Math.floor(currentEntity.stats.walkRadius),
				85,
				65
			);
			NumberFont.White.renderString(
				context2d,
				Math.floor(currentEntity.stats.evasiveness),
				85,
				78
			);

			// atk + def weaponwise and magicwise
			NumberFont.White.renderString(
				context2d,
				Math.floor(currentEntity.stats.weaponAttack),
				85,
				99
			);
			NumberFont.White.renderString(
				context2d,
				Math.floor(currentEntity.stats.weaponDefense),
				85,
				111
			);
			NumberFont.White.renderString(
				context2d,
				Math.floor(currentEntity.stats.magicAttack),
				85,
				123
			);
			NumberFont.White.renderString(
				context2d,
				Math.floor(currentEntity.stats.magicDefense),
				85,
				135
			);

			// inventory
			for (var i = 0, displayName = '', displayBoost = ''; i < 3; ++i) {
				if (currentEntity.stats.inventory[i] === undefined) {
					displayName = '-';
					displayBoost = '';
				} else {
					displayName = currentEntity.stats.inventory[i].name;
					displayBoost = currentEntity.stats.inventory[i].boostText;

					currentEntity.stats.inventory[i].icon.render(
						context2d,
						135,
						65 + i * 24
					);
				}

				Font.White.renderString(
					context2d,
					displayName,
					153,
					67 + i * 24
				);

				Font.Gold.renderString(
					context2d,
					displayBoost,
					235 - Font.Gold.getWidth(displayBoost),
					79 + i * 24
				);
			}
		}
	};
};
