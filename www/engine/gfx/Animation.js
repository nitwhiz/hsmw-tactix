/**
 * Holds animated images based on frames
 * @constructor
 * @param {Array<Object>} animation - An Array of Objects containing path and duration (milliseconds) of the frames
 * @param {Array<ColorCorrection>} corrections - A set of corrections to apply to the images, optional
 * @param {Boolean} noRepeat - True if the animation should play only once, not infinite times
 */
var Animation = function(animation, corrections, noRepeat) {
	var arts = [];
	var currentArt = 0;
	var currentDuration = 0;

	/**
	 * Holds the duration of this Animation
	 * @type {Number}
	 * @default 0
	 */
	this.duration = 0;

	animation.forEach(
		function(a) {
			if (a.path !== undefined && a.duration !== undefined) {
				arts.push({
					art: new Art(a.path, corrections || null),
					duration: a.duration
				});

				this.duration += a.duration;
			}
		}.bind(this)
	);

	/**
	 * Retrieve the current image as Art instance
	 * @returns {Art} The current frame of this animation
	 */
	this.getCurrentArt = function() {
		return arts[currentArt];
	};

	/**
	 * Update this Animation
	 * @param {Number} delta - The time between the last frame and this frame
	 */
	this.tick = function(delta) {
		currentDuration -= delta;

		if (currentDuration <= 0) {
			++currentArt;

			if (currentArt >= arts.length) {
				if (noRepeat === true) {
					--currentArt;
				} else {
					currentArt = 0;
				}
			}

			currentDuration = arts[currentArt].duration;
		}
	};

	/**
	 * Render this Animation
	 * @param {CanvasRenderingContext2D} context2d - The context to render the Animation in
	 * @param {Number} x - The vertical coordinate to render the Animation at
	 * @param {Number} y - The horizontal coordinate to render the Animation at
	 */
	this.render = function(context2d, x, y) {
		arts[currentArt].art.render(context2d, x, y);
	};

	/**
	 * Reset the Animation to its first frame as if it never ran
	 */
	this.reset = function() {
		currentArt = 0;
		currentDuration = arts[0].duration;
	};

	/**
	 * Retrieve a new instance of this animation, a by-value copy
	 * @param {Array<ColorCorrection>} otherCorrections - A set of corrections to override the current corrections with
	 * @returns {Animation} Another instance of the Animation
	 */
	this.instance = function(otherCorrections) {
		return new Animation(
			animation,
			otherCorrections || corrections,
			noRepeat
		);
	};
};
