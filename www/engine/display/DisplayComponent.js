/**
 * The Components used by Display
 * @constructor
 */
var DisplayComponent = function() {
	var isMoving = false;

	var targetX = 0;
	var targetY = 0;

	var stepX = 0;
	var stepY = 0;

	/**
	 * The vertical coordinate of this Component, in pixels
	 * @type {Number}
	 * @default 0
	 */
	this.x = 0;
	/**
	 * The horizontal coordinate of this Component, in pixels
	 * @type {Number}
	 * @default 0
	 */
	this.y = 0;

	/**
	 * The layer of this Component, bigger numbers mean the component is rendered later
	 * @type {Number}
	 * @default 0
	 */
	this.zIndex = 0;

	/**
	 * The visibility of this Component
	 * @type {Boolean}
	 * @default true
	 */
	this.visible = true;

	/**
	 * The wished speed of fx, if any, in milliseconds
	 * @type {Number}
	 * @default 300
	 */
	this.fxSpeed = 300;
	/**
	 * Determinates the threshold in which the animation shouldn't round, in pixels
	 * @type {Number}
	 * @default 20
	 */
	this.fxAccuracy = 20;

	var getTargetDistance = function() {
		return Math.sqrt(
			Math.pow(this.x - targetX, 2) + Math.pow(this.y - targetY, 2)
		);
	}.bind(this);

	/**
	 * Translates the context to the position of this Component, so all coordinates are relative to it's origin
	 * @param {CanvasRenderingContext2D} context2d - The context to translate
	 */
	this.preRender = function(context2d) {
		context2d.translate(this.x, this.y);
	};

	/**
	 * Holds the rendering of this DisplayComponent
	 * @abstract
	 * @param {CanvasRenderingContext2D} context2d - The context to render in
	 */
	this.render = function(context2d) {};

	/**
	 * Translates the context back to the original position
	 * @param {CanvasRenderingContext2D} context2d - The context to translate
	 */
	this.postRender = function(context2d) {
		context2d.translate(-this.x, -this.y);
	};

	/**
	 * Holds the updates of this DisplayComponent
	 * @abstract
	 * @param {Number} delta - The time between the last frame and this frame
	 */
	this.tick = function(delta) {};

	/**
	 * Manages fx, if any
	 * @param {Number} delta - The time between the last frame and this frame
	 */
	this.postTick = function(delta) {
		if (isMoving) {
			if (getTargetDistance() > this.fxAccuracy) {
				if (targetX > this.x) {
					this.x += delta / this.fxSpeed * stepX;
				} else if (targetX < this.x) {
					this.x -= delta / this.fxSpeed * stepX;
				}

				if (targetY > this.y) {
					this.y += delta / this.fxSpeed * stepY;
				} else if (targetY < this.y) {
					this.y -= delta / this.fxSpeed * stepY;
				}
			} else {
				isMoving = false;

				this.x = targetX;
				this.y = targetY;

				targetX = 0;
				targetY = 0;

				stepX = 0;
				stepY = 0;
			}
		}
	};

	/**
	 * Retrieves if this DisplayComponent is moved in this moment
	 * @returns {Boolean} True if it moves
	 */
	this.isAnimating = function() {
		return isMoving;
	};

	/**
	 * Initiates a translating fx
	 * @param {Number} newX - The vertical coordinate to move the Component to
	 * @param {Number} newY - The horizontal coordinate to move the Component to
	 */
	this.moveTo = function(newX, newY) {
		targetX = newX;
		targetY = newY;

		stepX = Math.abs(this.x - targetX);
		stepY = Math.abs(this.y - targetY);

		isMoving = true;
	};
};
