/**
 * Enables color correction based on a channel
 * @constructor
 * @param {Object} channel - The channel to attack
 * @param {Object} correction - The corrections to apply
 */
var ColorCorrection = function(channel, correction) {
	/**
	 * The channel to attack
	 * @type {Object}
	 */
	this.channel = channel;
	/**
	 * The corrections to apply
	 * @type {Object}
	 */
	this.correction = correction;

	/**
	 * Retrieve the distance between a color (as CMYK) and the channel of this ColorCorrection
	 * @param {Object} color - The color
	 * @return {Number} The distance
	 */
	this.channelDistance = function(color) {
		return (
			((this.channel.C > 0 ? color.C / this.channel.C : 0) +
				(this.channel.M > 0 ? color.M / this.channel.M : 0) +
				(this.channel.Y > 0 ? color.Y / this.channel.Y : 0) +
				(this.channel.K > 0 ? color.K / this.channel.K : 0)) /
			4
		);
	};

	/**
	 * Apply the corrections to a set of RGB values
	 * @param {Number} r - The red channel
	 * @param {Number} g - The green channel
	 * @param {Number} b - The blue channel
	 * @returns {Object} - The corrected RGB values
	 */
	this.apply = function(r, g, b) {
		var color = Color.RGBToCMYK(r, g, b);

		var f = this.channelDistance(color);

		color.C += f * this.correction.C;
		color.M += f * this.correction.M;
		color.Y += f * this.correction.Y;
		color.K += f * this.correction.K;

		color.C = Math.min(1, Math.max(0, color.C));
		color.M = Math.min(1, Math.max(0, color.M));
		color.Y = Math.min(1, Math.max(0, color.Y));
		color.K = Math.min(1, Math.max(0, color.K));

		color = Color.CMYKToRGB(color.C, color.M, color.Y, color.K);

		return {
			R: color.R,
			G: color.G,
			B: color.B
		};
	};
};
