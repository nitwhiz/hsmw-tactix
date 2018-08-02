/**
 * DisplayComponent for popups
 * @constructor
 * @extends {DisplayComponent}
 */
var Pops = function() {
	DisplayComponent.call(this);

	var queue = [];

	/**
	 * Add an Art to float above the Entity
	 * @param {Art} art - The Art to render
	 * @param {String} text - The text to render
	 * @param {Number} oX - The vertical origin coordinate to render this Art at
	 * @param {Number} oY - The horizontal origin coordinate to render this Art at
	 * @param {Number} duration - How long the text should be floating up until it disappears, in milliseconds
	 */
	this.floatArtUp = function(art, oX, oY, duration) {
		queue.push({
			art: art,
			x: oX,
			y: oY,
			dx: 0,
			dy: -0.35,
			duration: duration || 750,
			type: 'art',
			behaviour: 'translate'
		});
	};

	/**
	 * Add an text to float above the Entity
	 * @param {Font} font - The Font to render the text in
	 * @param {String} text - The text to render
	 * @param {Number} oX - The vertical origin coordinate to render this Art at
	 * @param {Number} oY - The horizontal origin coordinate to render this Art at
	 * @param {Number} duration - How long the text should be floating up until it disappears, in milliseconds
	 */
	this.floatTextUp = function(font, text, oX, oY, duration) {
		queue.push({
			font: font,
			text: text,
			x: oX,
			y: oY,
			dx: 0,
			dy: -0.35,
			duration: duration || 750,
			type: 'text',
			behaviour: 'translate'
		});
	};

	/**
	 * Add an Art to hover above the Entity
	 * @param {Art} art - The Art to render
	 * @param {Number} oX - The vertical origin coordinate to render this Art at
	 * @param {Number} oY - The horizontal origin coordinate to render this Art at
	 */
	this.hoverArt = function(art, oX, oY) {
		queue.push({
			art: art,
			x: oX,
			y: oY,
			oX: oX,
			oY: oY,
			timer: 0,
			type: 'art',
			behaviour: 'hover'
		});
	};

	/**
	 * Update the DisplayComponent
	 * @override
	 * @param {Number} delta - The delay between the last frame and this frame
	 */
	this.tick = function(delta) {
		for (var i = 0, l = queue.length; i < l; ++i) {
			if (queue[i].behaviour === 'translate') {
				queue[i].x += queue[i].dx;
				queue[i].y += queue[i].dy;

				queue[i].duration -= delta;

				if (queue[i].duration <= 0) {
					queue.splice(i, 1);
					--l;
				}
			} else if (queue[i].behaviour === 'hover') {
				queue[i].y =
					queue[i].oY +
					Math.sin(queue[i].timer / 1500 * 2 * Math.PI) * 4;

				queue[i].timer += delta;

				if (queue[i].timer >= 1500) {
					queue[i].timer -= 1500;
				}
			}
		}
	};

	/**
	 * Render the GameState
	 * @override
	 * @param {CanvasRenderingContext2D} context2d - The context to render this frame in
	 */
	this.render = function(context2d) {
		for (var i = 0, l = queue.length; i < l; ++i) {
			if (queue[i].type === 'art') {
				queue[i].art.render(
					context2d,
					Math.floor(queue[i].x),
					Math.floor(queue[i].y)
				);
			} else if (queue[i].type === 'text') {
				queue[i].font.renderString(
					context2d,
					queue[i].text,
					Math.floor(queue[i].x),
					Math.floor(queue[i].y)
				);
			}
		}
	};
};

Pops.prototype = Object.create(DisplayComponent.prototype);
