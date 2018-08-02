/**
 * Utilities
 * @namespace
 */
var Utils = {
	uid: 1000,
	/**
	 * Precalculated sine and cosine of 45 degrees
	 * @type {Number}
	 * @default 0.7071067811865
	 */
	sin_cos_45: 1 / Math.sqrt(2),
	/**
	 * Calculate angle between x-Axis and the line between P1(x1, y1) and P2(x2, y2), in radians
	 * @param {Number} x1 - x coordinate of point 1
	 * @param {Number} y1 - y coordinate of point 1
	 * @param {Number} x2 - x coordinate of point 2
	 * @param {Number} y2 - y coordinate of point 2
	 * @returns {Number}
	 */
	getAngle: function(x1, y1, x2, y2) {
		var dx = x1 - x2;
		var dy = y1 - y2;

		var angle = Math.atan(dy / dx);

		if (dx < 0) {
			angle += Math.PI;
		}

		return angle;
	},
	/**
	 * Calculate the angle between x-Axis and the line between P1(x1, y1) and P2(x2, y2), in degrees and floored
	 * @param {Number} x1 - x coordinate of point 1
	 * @param {Number} y1 - y coordinate of point 1
	 * @param {Number} x2 - x coordinate of point 2
	 * @param {Number} y2 - y coordinate of point 2
	 * @returns {Number}
	 */
	getAngleDegrees: function(x1, y1, x2, y2) {
		var angle = Math.floor(Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI);

		if (angle < 0) {
			angle += 360;
		}

		if (angle > 360) {
			angle -= 360;
		}

		return angle;
	},
	/**
	 * Calculate the distance between P1(x1, y1) and P2(x2, y2)
	 * @param {Number} x1 - x coordinate of point 1
	 * @param {Number} y1 - y coordinate of point 1
	 * @param {Number} x2 - x coordinate of point 2
	 * @param {Number} y2 - y coordinate of point 2
	 * @returns {Number}
	 */
	getDistance: function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	},
	/**
	 * Calculate the distance between P1(x1, y1) and P2(x2, y2) without taking the root
	 * (faster)
	 * @param {Number} x1 - x coordinate of point 1
	 * @param {Number} y1 - y coordinate of point 1
	 * @param {Number} x2 - x coordinate of point 2
	 * @param {Number} y2 - y coordinate of point 2
	 * @returns {Number}
	 */
	getDistance2: function(x1, y1, x2, y2) {
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	},
	/**
	 * Merges two arrays into a new one
	 * Takes all elements from the first and appends all from the second
	 * @param {Array<?>} arr1 - Array 1
	 * @param {Array<?>} arr2 - Array 2
	 * @returns {Array<?>}
	 */
	merge: function(arr1, arr2) {
		var result = [];

		for (var i = 0, l = arr1.length; i < l; ++i) {
			result.push(arr1[i]);
		}

		for (var i = 0, l = arr2.length; i < l; ++i) {
			result.push(arr2[i]);
		}

		return result;
	},
	/**
	 * Extends a base Object
	 * Looks for all properties of base in ext. If the property is defined in ext, the value is set to ext[prop]. If the property is not defined in ext, the value is set to base[prop]
	 * @param {Object} base - Base Object
	 * @param {Object} ext - Extending Object
	 * @returns {Object}
	 */
	extend: function(base, ext) {
		if (typeof ext === 'undefined') {
			return base;
		}

		var result = {};

		for (var baseProp in base) {
			if (base.hasOwnProperty(baseProp)) {
				result[baseProp] =
					ext[baseProp] !== undefined
						? ext[baseProp]
						: base[baseProp];
			}
		}

		return result;
	},
	/**
	 * Rounds a Number to .5
	 * @param {Number} num - Number to round
	 * @returns {Number}
	 */
	roundPt5: function(num) {
		return Math.floor(num) + 0.5;
	},
	/**
	 * Calculates the degrees from radians
	 * @param {Number} angle - Radians to convert
	 * @returns {Number}
	 */
	toDegrees: function(angle) {
		angle = angle * 180 / Math.PI;

		if (angle < 0) {
			angle += 360;
		}

		return angle;
	},
	/**
	 * Calculates the radians from degrees
	 * @param {Number} angle - Degrees to convert
	 * @returns {Number}
	 */
	toRadians: function(angle) {
		return angle * Math.PI / 180;
	},
	/**
	 * Retrieve an unique identifier
	 * Increments every call
	 * @returns {Number}
	 */
	getUID: function() {
		return ++Utils.uid;
	}
};
