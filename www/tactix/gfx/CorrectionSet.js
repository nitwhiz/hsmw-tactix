/**
 * Holds sets of corrections used by the game
 * @namespace
 */
var CorrectionSet = {
	BLUE_RED: [
		new ColorCorrection(ColorChannel.CYAN, { C: -1, M: 1, Y: 1, K: 0 }),
		new ColorCorrection(ColorChannel.BLUE, { C: -1, M: 1, Y: 4, K: 0 })
	],
	BLUE_YELLOW: [
		new ColorCorrection(ColorChannel.CYAN, { C: -1, M: -1, Y: 3, K: 0 }),
		new ColorCorrection(ColorChannel.BLUE, { C: -1, M: -1, Y: 3, K: 0 }),
		new ColorCorrection(ColorChannel.YELLOW, { C: -1, M: -1, Y: 3, K: -3 })
	],
	BLUE_GREEN: [
		new ColorCorrection(ColorChannel.CYAN, { C: 2, M: 0, Y: 3, K: 0 }),
		new ColorCorrection(ColorChannel.BLUE, { C: 2, M: 0, Y: 3, K: 0 }),
		new ColorCorrection(ColorChannel.GREEN, { C: 0, M: 0, Y: 0, K: -1.25 })
	],
	GREEN_RED: [
		new ColorCorrection(ColorChannel.GREEN, {
			C: -3,
			M: 1.5,
			Y: 1.5,
			K: 0
		}),
		new ColorCorrection(ColorChannel.YELLOW, {
			C: -3,
			M: 1.5,
			Y: 1.5,
			K: 0.5
		})
	]
};
