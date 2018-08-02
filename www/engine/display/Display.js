/**
 * Holds DisplayComponents to accomplish more structurized rendering process
 * @constructor
 */
var Display = function() {
	var components = [];

	var eachComponent = function(callback) {
		for (var i = 0, l = components.length; i < l; ++i) {
			callback(components[i]);
		}
	};

	/**
	 * Adds a DisplayComponent to let it tick and render every frame
	 * @param {DisplayComponent} component - The component to add to this Display
	 */
	this.addComponent = function(component) {
		components.push(component);

		components.sort(function(a, b) {
			return a.zIndex - b.zIndex;
		});
	};

	/**
	 * Update the DisplayComonents in this Display
	 * @param {Number} delta - The time between the last frame and this frame
	 */
	this.tick = function(delta) {
		eachComponent(function(component) {
			if (component.visible) {
				component.tick(delta);
				component.postTick(delta);
			}
		});
	};

	/**
	 * Render the DisplayComonents in this Display
	 * @param {CanvasRenderingContext2D} context2d - The context to render the DisplayComonents in 
	 */
	this.render = function(context2d) {
		eachComponent(function(component) {
			if (component.visible) {
				component.preRender(context2d);
				component.render(context2d);
				component.postRender(context2d);
			}
		});
	};
};
