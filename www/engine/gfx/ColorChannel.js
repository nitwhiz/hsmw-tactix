/**
 * A collection of CMYK channels for ColorCorrection
 * @namespace
 */
var ColorChannel = {
	/**
	 * Cyan channel
	 * @type {Object}
	 */
	CYAN: { C: 1, M: 0, Y: 0, K: 0 },
	/**
	 * Blue channel
	 * @type {Object}
	 */
	BLUE: { C: 1, M: 1, Y: 0, K: 0 },
	/**
	 * Magenta channel
	 * @type {Object}
	 */
	MAGENTA: { C: 0, M: 1, Y: 0, K: 0 },
	/**
	 * Red channel
	 * @type {Object}
	 */
	RED: { C: 0, M: 1, Y: 1, K: 0 },
	/**
	 * Yellow channel
	 * @type {Object}
	 */
	YELLOW: { C: 0, M: 0, Y: 1, K: 0 },
	/**
	 * Green channel
	 * @type {Object}
	 */
	GREEN: { C: 1, M: 0, Y: 1, K: 0 }
};
