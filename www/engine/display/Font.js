/**
 * Holds a font based on an image file (aka charset)
 * @constructor
 * @param {String} fontPath - Path to charset
 * @param {Number} fontSetWidth - Width of the charset
 * @param {Number} fontSetHeight - Height of the charset
 * @param {Number} fontSize - Determinates how much space a character can use vertically and horizontally in the charset
 */
var Font = function(fontPath, fontSetWidth, fontSetHeight, fontSize) {
	/**
	 * Determinates how much space a character can use vertically and horizontally in the image
	 * @type {Number}
	 * @default 12
	 */
	this.fontSize = fontSize || 12;
	/**
	 * Determinates how high a line of text is. After a newline (\n) the next line starts at (x, y + lineHeight)
	 * @type {Number}
	 * @default 14
	 */
	this.lineHeight = 14;
	/**
	 * Determinates the space between characters on rendering
	 * @type {Number}
	 * @default 0
	 */
	this.letterSpacing = 0;

	/**
	 * The canvas with the charset drawn on. Exposed for usage in extending classes
	 * @type {HTMLCanvasElement}
	 */
	this.canvas = document.createElement('canvas');

	this.canvas.width = fontSetWidth;
	this.canvas.height = fontSetHeight;

	var ctx = this.canvas.getContext('2d');

	var fontImg = new Image();

	var charWidths = {};

	var magentaKey = (255 << 24) | (0 << 16) | (255 << 8) | 255;

	var calcColumn = function(c) {
		return (c - c % 32) / 32 - 1;
	};

	fontImg.onload = function() {
		ctx.drawImage(fontImg, 0, 0);

		var cwX = 0;
		var cwY = 0;

		var tmpImgData = null;

		for (var i = 32, cW = 0, cS = 0; i < 128; ++i) {
			cwX = this.fontSize * calcColumn(i);
			cwY = (i % 32) * this.fontSize;

			tmpImgData = ctx.getImageData(cwX, cwY, this.fontSize, 1);

			// character width
			cW = 0;
			// character offset left
			cS = 0;

			for (var id = 0, idl = tmpImgData.data.length; id < idl; id += 4) {
				if (cW > 0) {
					++cW;
				}

				if (
					((tmpImgData.data[id] << 24) |
						(tmpImgData.data[id + 1] << 16) |
						(tmpImgData.data[id + 2] << 8) |
						tmpImgData.data[id + 3]) ===
					magentaKey
				) {
					tmpImgData.data[id] = 0;
					tmpImgData.data[id + 1] = 0;
					tmpImgData.data[id + 2] = 0;
					tmpImgData.data[id + 3] = 0;

					ctx.putImageData(tmpImgData, cwX, cwY);

					if (cW === 0) {
						++cW;
						cS = id / 4;
					} else {
						break;
					}
				}
			}

			charWidths[i] = {
				width: cW,
				start: cS
			};
		}
	}.bind(this);

	fontImg.src = fontPath;

	/**
	 * Retrieves the width of a string rendered with this charset in pixels
	 * @returns {Number} The width
	 */
	this.getWidth = function(str) {
		var width = 0;

		for (var i = 0, l = str.length; i < l; ++i) {
			width += charWidths[str.charCodeAt(i)].width;
		}

		return width;
	};

	/**
	 * Renders the string in a context
	 * @param {CanvasRenderingContext2D} context2d - The context to render the string in
	 */
	this.renderString = function(context2d, str, x, y) {
		str = '' + str;

		var oX = x;
		var oY = y;

		var sX = 0;
		var sY = 0;

		var currentCharWidth = 0;
		var currentCharStart = 0;

		for (var i = 0, l = str.length, c = 0; i < l; ++i) {
			c = str.charCodeAt(i);

			if (c === 10) {
				y += this.lineHeight;
				x = oX;

				continue;
			} else if (c < 32) {
				c = 42;
			}

			if (charWidths[c]) {
				currentCharWidth = charWidths[c].width;
				currentCharStart = charWidths[c].start;
			} else {
				continue;
			}

			sX = this.fontSize * calcColumn(c);
			sY = (c % 32) * this.fontSize;

			context2d.drawImage(
				this.canvas,
				sX + currentCharStart,
				sY,
				currentCharWidth,
				this.fontSize,
				x,
				y,
				currentCharWidth,
				this.fontSize
			);

			x += currentCharWidth + this.letterSpacing;
		}
	};
};

/**
 * A white font with black outline
 * @static
 * @type {Font}
 */
Font.White = new Font('assets/font/text_white.png', 36, 384, 12);
/**
 * A violet font with black outline
 * @static
 * @type {Font}
 */
Font.Violet = new Font('assets/font/text_violet.png', 36, 384, 12);
/**
 * A yellow font with black outline
 * @static
 * @type {Font}
 */
Font.Yellow = new Font('assets/font/text_yellow.png', 36, 384, 12);
/**
 * A gold font with black outline
 * @static
 * @type {Font}
 */
Font.Gold = new Font('assets/font/text_gold.png', 36, 384, 12);
