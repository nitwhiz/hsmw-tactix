/**
 * Used for debugging, therefore undocumented
 * @namespace
 */
var PerformanceCounter = {
	deltaSum: 0,
	deltaCount: 100,
	deltas: [],
	renderFPS: true,
	renderGraph: false,
	renderDebug: false,
	currentColor: 'rgba(127, 0, 255, .75)',
	debug: [],
	graphX: 80,
	tick: function(delta) {
		PerformanceCounter.deltas.unshift({
			delta: delta,
			color: PerformanceCounter.currentColor
		});

		if (PerformanceCounter.deltas.length > PerformanceCounter.deltaCount) {
			PerformanceCounter.deltas.pop();
		}

		PerformanceCounter.currentColor = 'rgba(127, 0, 255, .75)';
	},
	render: function(context2d) {
		PerformanceCounter.deltaSum = 0;

		for (var i = 0; i < PerformanceCounter.deltaCount; ++i) {
			if (PerformanceCounter.deltas[i] !== undefined) {
				PerformanceCounter.deltaSum +=
					PerformanceCounter.deltas[i].delta;

				if (PerformanceCounter.renderGraph) {
					context2d.fillStyle = PerformanceCounter.deltas[i].color;

					context2d.fillRect(
						i + PerformanceCounter.graphX,
						160 - (PerformanceCounter.deltas[i].delta || 0),
						1,
						PerformanceCounter.deltas[i].delta || 0
					);

					context2d.fillStyle = 'rgba(0, 255, 127, .75)';

					context2d.fillRect(
						i + PerformanceCounter.graphX,
						160 - 16,
						1,
						1
					);

					context2d.fillStyle = 'rgba(255, 127, 0, .75)';

					context2d.fillRect(
						i + PerformanceCounter.graphX,
						160 - 40,
						1,
						1
					);

					Font.White.renderString(
						context2d,
						'60',
						PerformanceCounter.graphX,
						160 - 16 - 6
					);
					Font.White.renderString(
						context2d,
						'25',
						PerformanceCounter.graphX,
						160 - 40 - 6
					);
				}
			}
		}

		if (PerformanceCounter.renderFPS) {
			Font.White.renderString(
				context2d,
				Math.round(
					1000 /
						(PerformanceCounter.deltaSum /
							PerformanceCounter.deltaCount)
				),
				2,
				2
			);
		}

		if (PerformanceCounter.renderDebug) {
			for (var i = 0, l = PerformanceCounter.debug.length; i < l; ++i) {
				Font.White.renderString(
					context2d,
					PerformanceCounter.debug[i] + '',
					2,
					14 + i * 12
				);
			}
		}
	}
};
