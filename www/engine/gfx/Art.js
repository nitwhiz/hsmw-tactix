/**
 * Holds an image modified by optional corrections. If rendered before loading is done, it'll render invisible
 * @constructor
 * @param {String} path - The path to the image
 * @param {Array<ColorCorrection>} corrections - The corrections to apply to the image, optional
 */
var Art = function(path, corrections) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	var image = new Image();

	// wider feature range

	image.addEventListener('load', function() {
		++Art.loadedArts;

		canvas.width = image.width;
		canvas.height = image.height;

		ctx.drawImage(image, 0, 0);

		if (corrections instanceof Array && corrections.length > 0) {
			var ctxData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			var r, g, b, corrected;

			for (var i = 0, l = ctxData.data.length; i < l; i += 4) {
				r = ctxData.data[i];
				g = ctxData.data[i + 1];
				b = ctxData.data[i + 2];

				for (var c = 0, lC = corrections.length; c < lC; ++c) {
					if (corrections[c] instanceof ColorCorrection) {
						corrected = corrections[c].apply(r, g, b);

						r = corrected.R;
						g = corrected.G;
						b = corrected.B;
					}
				}

				ctxData.data[i] = r;
				ctxData.data[i + 1] = g;
				ctxData.data[i + 2] = b;
			}

			ctx.putImageData(ctxData, 0, 0);
		}
	});

	image.src = path;

	++Art.availableArts;

	/**
	 * Rotates the image, relative to previous rotations
	 * @param {Number} angle - Angle in degrees
	 */
	this.setRotation = function(angle) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(Utils.toRadians(angle));
		ctx.translate(-canvas.width / 2, -canvas.height / 2);

		ctx.drawImage(image, 0, 0);
	};

	this.render = function(context2d, x, y) {
		context2d.drawImage(canvas, x, y);
	};
};

/**
 * Holds the count of instantiated Arts. Used to determinate if all images are loaded
 * @type {Number}
 * @default 0
 */
Art.availableArts = 0;
/**
 * Holds the count of loaded Arts. Used to determinate if all images are loaded
 * @type {Number}
 * @default 0
 */
Art.loadedArts = 0;

/**
 * Retrieves whether all images are loaded
 * @returns {Boolean} True if all images are ready
 */
Art.isReady = function() {
	return Art.loadedArts === Art.availableArts;
};
