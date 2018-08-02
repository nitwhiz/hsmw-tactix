/**
 * Keeps track of Stages and their changes and allows async triggers to be called when the State changes specifically
 * @constructor
 * @param {Stage} initialStage - Apply this Stage as initial Stage
 */
var Staging = function(initialStage) {
	var currentStage = initialStage || null;
	var lastStage = null;

	var stageTrigger = {};

	/**
	 * Add a trigger for all Stages listed in stages
	 * @param {Array<Stage>} stages - The stages to trigger func on
	 * @param {Function} func - A callback, runs async to game tick and render
	 */
	this.addTrigger = function(stages, func) {
		for (var i = 0, l = stages.length; i < l; ++i) {
			if (stageTrigger[stages[i]] === undefined) {
				stageTrigger[stages[i]] = [];
			}

			stageTrigger[stages[i]].push(func);
		}
	};

	/**
	 * Retrieve the current Stage
	 * @returns {Stage}
	 */
	this.getCurrent = function() {
		return currentStage;
	};

	/**
	 * Retrieve the previous Stage
	 * @returns {Stage}
	 */
	this.getLast = function() {
		return lastStage;
	};

	/**
	 * Set the current Stage, keeps track of the previous Stage
	 * @param {Stage} stage - The Stage to set
	 */
	this.setCurrent = function(stage) {
		lastStage = currentStage;
		currentStage = stage;

		if (stageTrigger[stage] !== undefined) {
			for (var i = 0, l = stageTrigger[stage].length; i < l; ++i) {
				stageTrigger[stage][i]();
			}
		}
	};

	/**
	 * Retrieve whether the current Stage is one of the specified Stages
	 * @param {Array<Stage>} stages - The Stages to check
	 * @returns {Boolean}
	 */
	this.currentIs = function(stages) {
		if (typeof stages === 'number') {
			return stages === currentStage;
		}

		return stages.indexOf(currentStage) > -1;
	};

	/**
	 * Retrieve whether the previous Stage is one of the specified Stages
	 * @param {Array<Stage>} stages - The Stages to check
	 * @returns {Boolean}
	 */
	this.lastWas = function(stages) {
		if (typeof stages === 'number') {
			return stages === lastStage;
		}

		return stages.indexOf(lastStage) > -1;
	};
};
