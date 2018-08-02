/**
 * Holds the available and current Cursor(s)
 * @namespace
 */
var Cursor = {
	/**
	 * All available Cursors
	 * @type {Object}
	 * @default {}
	 */
	cursors: {},
	/**
	 * Current Cursor id
	 * @type {String}
	 * @default ''
	 */
	current: '',
	/**
	 * Adds an available Cursor
	 * @param {String} name - An id
	 * @param {String} url - The path to the image of the Cursor
	 */
	add: function(name, url) {
		Cursor.cursors[name] = url;
	},
	/**
	 * Sets the current cursor to a specifc HTMLNode
	 * @param {String} name - An id
	 * @param {HMTLNode} node - The node to apply the Cursor to
	 */
	set: function(name, node) {
		node.style.cursor = "url('" + Cursor.cursors[name] + "'), auto";
		Cursor.current = name;
	}
};
