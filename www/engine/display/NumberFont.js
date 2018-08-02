/**
 * Holds a font based on an image file (aka charset), but with monospaced numbers and leading slash only
 * @constructor
 * @extends {Font}
 * @param {String} fontPath - Path to charset
 * @param {Number} fontSetWidth - Width of the charset
 * @param {Number} fontSetHeight - Height of the charset
 * @param {Number} fontSize - Determinates how much space a character can use vertically and horizontally in the charset
 */
var NumberFont = function(fontPath, fontSetWidth, fontSetHeight, fontSize) {
	Font.call(this, fontPath, fontSetWidth, fontSetHeight, fontSize || 8);

	this.renderString = function(context2d, str, x, y) {
		str = '' + str;

		for (var i = 0, l = str.length, c = 0; i < l; ++i) {
			c = str.charCodeAt(i);

			if (c < 47 || c > 57) {
				continue;
			}

			context2d.drawImage(
				this.canvas,
				(c - 47) * this.fontSize,
				0,
				this.fontSize,
				this.fontSize,
				x,
				y,
				this.fontSize,
				this.fontSize
			);

			x += this.fontSize + this.letterSpacing;
		}
	};

	this.getWidth = function(str) {
		return (str + '').length * fontSize;
	};
};

NumberFont.prototype = Object.create(Font.prototype);

/**
 * A white font with black outline
 * @static
 * @type {NumberFont}
 */
NumberFont.White = new NumberFont('assets/font/numbers_white.png', 88, 8, 8);
/**
 * A red font with black outline
 * @static
 * @type {NumberFont}
 */
NumberFont.Red = new NumberFont('assets/font/numbers_red.png', 88, 8, 8);
