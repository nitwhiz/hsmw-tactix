/**
 * Holds a Color representation as channels
 * @namespace
 */
var Color = {
	/**
	 * Returns CMYK color from RGB
	 * @param {Number} r - Red channel between 0 and 255
	 * @param {Number} g - Green channel between 0 and 255
	 * @param {Number} b - Blue channel between 0 and 255
	 * @returns {Object} CMYK as values between 0 and 1 (exclusive)
	 */
	RGBToCMYK: function(r, g, b) {
		if (r === 0 && g === 0 && b === 0) {
			return { C: 0, M: 0, Y: 0, K: 1 };
		}

		r /= 255;
		g /= 255;
		b /= 255;

		var k = 1 - Math.max(r, g, b);

		return {
			C: (1 - r - k) / (1 - k),
			M: (1 - g - k) / (1 - k),
			Y: (1 - b - k) / (1 - k),
			K: k
		};
	},
	/**
	 * Returns RGB color from CMYK
	 * @param {Number} c - Cyan channel between 0 and 1 (exclusive)
	 * @param {Number} m - Magenta channel between 0 and 1 (exclusive)
	 * @param {Number} y - Yellow channel between 0 and 1 (exclusive)
	 * @param {Number} k - Black channel between 0 and 1 (exclusive)
	 * @returns {Object} RGB as values between 0 and 255
	 */
	CMYKToRGB: function(c, m, y, k) {
		return {
			R: Math.floor(255 * (1 - c) * (1 - k)),
			G: Math.floor(255 * (1 - m) * (1 - k)),
			B: Math.floor(255 * (1 - y) * (1 - k))
		};
	}
};
